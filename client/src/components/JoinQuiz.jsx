
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import io from "socket.io-client";

// export default function JoinQuiz() {
//   const { quizId } = useParams();
//   const navigate = useNavigate();
//   const [quiz, setQuiz] = useState(null);
//   const [answers, setAnswers] = useState({});
//   const [score, setScore] = useState(null);
//   const [socket, setSocket] = useState(null);

//   // Player's name (ask before starting quiz)
//   const [playerName, setPlayerName] = useState("");
//   const [nameSubmitted, setNameSubmitted] = useState(false);

//   useEffect(() => {
//     if (!nameSubmitted) return; // don’t connect until name is entered

//     const newSocket = io("http://localhost:5050");
//     setSocket(newSocket);

//     // Join room with player name
//     newSocket.emit("join-room", { quizId, playerName });

//     // Fetch quiz data
//     fetch(`http://localhost:5050/api/get-quiz/${quizId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setQuiz(data);
//         setScore(null);
//         setAnswers({});
//       })
//       .catch((err) => console.error("Error fetching quiz:", err));

//     // Listen when other players join
//     newSocket.on("user-joined", (joinedUser) => {
//       console.log(`User joined: ${joinedUser}`);
//     });

//     return () => {
//       newSocket.disconnect();
//     };
//   }, [quizId, nameSubmitted, playerName]);

//   const handleSubmit = () => {
//     if (!quiz) return;

//     const correctCount = quiz.questions.filter(
//       (q, i) => answers[i] === q.correctAnswer
//     ).length;

//     setScore(correctCount);

//     // Save result
//     fetch("http://localhost:5050/api/save-quiz", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         quizId,
//         userId: playerName, // use entered name instead of random ID
//         questions: quiz.questions.map((q, i) => ({
//           ...q,
//           selectedAnswer: answers[i] || null,
//         })),
//         score: correctCount,
//         total: quiz.questions.length,
//       }),
//     });

//     if (socket) {
//       socket.emit("quiz-submitted", {
//         quizId,
//         userId: playerName,
//         score: correctCount,
//         total: quiz.questions.length,
//       });
//     }
//   };

//   const handleRetry = () => {
//     setAnswers({});
//     setScore(null);
//   };

//   // Step 1 → Ask for player name
//   if (!nameSubmitted) {
//     return (
//       <div>
//         <h2>Enter Your Name to Join Quiz</h2>
//         <input
//           type="text"
//           placeholder="Your name..."
//           value={playerName}
//           onChange={(e) => setPlayerName(e.target.value)}
//         />
//         <button
//           disabled={!playerName.trim()}
//           onClick={() => setNameSubmitted(true)}
//         >
//           Join Quiz
//         </button>

//         {/* Always show Back to Homepage */}
//         <div style={{ marginTop: "10px" }}>
//           <button onClick={() => navigate("/")}>🏠 Back to Homepage</button>
//         </div>
//       </div>
//     );
//   }

//   // Step 2 → Show quiz
//   if (!quiz) return <p>Loading quiz...</p>;

//   return (
//     <div>
//       <h2>Welcome, {playerName}!</h2>
//       <button onClick={() => navigate("/")}>🏠 Back to Homepage</button>

//       {score === null ? (
//         <>
//           {quiz.questions.map((q, index) => (
//             <div key={index}>
//               <p>{q.question}</p>
//               {q.options.map((option, i) => (
//                 <label key={i}>
//                   <input
//                     type="radio"
//                     name={`q-${index}`}
//                     value={option}
//                     checked={answers[index] === option}
//                     onChange={() =>
//                       setAnswers({ ...answers, [index]: option })
//                     }
//                   />
//                   {option}
//                 </label>
//               ))}
//             </div>
//           ))}
//           <button onClick={handleSubmit}>Submit</button>
//         </>
//       ) : (
//         <>
//           <p>
//             ✅ {playerName}, your score: {score}/{quiz.questions.length}
//           </p>
//           <button onClick={handleRetry}>🔄 Retry Quiz</button>
//         </>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";

export default function JoinQuiz() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [socket, setSocket] = useState(null);

  const [playerName, setPlayerName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);

  useEffect(() => {
    if (!nameSubmitted) return;

    const newSocket = io("http://localhost:5050");
    setSocket(newSocket);

    newSocket.emit("join-room", { quizId, playerName });

    fetch(`http://localhost:5050/api/get-quiz/${quizId}`)
      .then((res) => res.json())
      .then((data) => {
        setQuiz(data);
        setScore(null);
        setAnswers({});
      });

    return () => {
      newSocket.disconnect();
    };
  }, [quizId, nameSubmitted, playerName]);

  const handleSubmit = () => {
    if (!quiz) return;

    const correctCount = quiz.questions.filter(
      (q, i) => answers[i] === q.correctAnswer
    ).length;

    setScore(correctCount);

    fetch("http://localhost:5050/api/save-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quizId,
        userId: playerName,
        questions: quiz.questions.map((q, i) => ({
          ...q,
          selectedAnswer: answers[i] || null,
        })),
        score: correctCount,
        total: quiz.questions.length,
      }),
    });

    if (socket) {
      socket.emit("quiz-submitted", {
        quizId,
        userId: playerName,
        score: correctCount,
        total: quiz.questions.length,
      });
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setScore(null);
  };

  if (!nameSubmitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Enter Your Name</h2>
          <input
            type="text"
            placeholder="Your name..."
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
          />
          <button
            disabled={!playerName.trim()}
            onClick={() => setNameSubmitted(true)}
            className="w-full bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
          >
            Join Quiz
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition"
          >
            🏠 Back to Homepage
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) return <p className="text-center mt-10">Loading quiz...</p>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl space-y-6">
        <h2 className="text-2xl font-bold text-gray-700">
          Welcome, {playerName}!
        </h2>

        <button
          onClick={() => navigate("/")}
          className="bg-gray-500 text-white py-2 px-6 rounded-lg hover:bg-gray-600 transition"
        >
          🏠 Back to Homepage
        </button>

        {score === null ? (
          <>
            {quiz.questions.map((q, index) => (
              <div key={index} className="mb-4">
                <p className="font-medium text-gray-800">{q.question}</p>
                <div className="flex flex-col mt-2 space-y-2">
                  {q.options.map((option, i) => (
                    <label
                      key={i}
                      className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md border"
                    >
                      <input
                        type="radio"
                        name={`q-${index}`}
                        value={option}
                        checked={answers[index] === option}
                        onChange={() =>
                          setAnswers({ ...answers, [index]: option })
                        }
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition"
            >
              Submit
            </button>
          </>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-lg font-semibold text-gray-800">
              ✅ {playerName}, your score: {score}/{quiz.questions.length}
            </p>
            <button
              onClick={handleRetry}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
            >
              🔄 Retry Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
