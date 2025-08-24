// import React, { useEffect, useState } from 'react';
// import { useParams, useLocation, useNavigate } from 'react-router-dom';

// const QuizRoom = () => {
//   const { quizId } = useParams();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const userName = location.state?.userName;

//   const [quiz, setQuiz] = useState([]);
//   const [summary, setSummary] = useState('');
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Fetch quiz from backend
//   useEffect(() => {
//     const fetchQuiz = async () => {
//       try {
//         const res = await fetch(`http://localhost:5050/api/get-quiz/${quizId}`);
//         const data = await res.json();
//         setQuiz(data.questions || []);
//         setSummary(data.summary || '');
//       } catch (err) {
//         console.error('Failed to fetch quiz:', err);
//         alert('Failed to load quiz.');
//       }
//     };

//     fetchQuiz();
//   }, [quizId]);

//   // Handle option selection
//   const handleOptionClick = (option) => {
//     setSelectedAnswers({
//       ...selectedAnswers,
//       [currentIndex]: option
//     });
//   };

//   // Go to next question or submit if last
//   const handleNext = () => {
//     if (currentIndex < quiz.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       handleSubmitQuiz();
//     }
//   };

//   // Submit quiz result to backend
//   const handleSubmitQuiz = async () => {
//     if (!userName) {
//       alert('Username missing. Please go back and join again.');
//       return;
//     }

//     setIsSubmitting(true);

//     const completedQuiz = quiz.map((q, index) => ({
//       ...q,
//       selectedAnswer: selectedAnswers[index] || '',
//     }));

//     const correctAnswers = completedQuiz.filter(q => q.selectedAnswer === q.answer).length;
//     const total = quiz.length;
//     const score = correctAnswers;

//     const payload = {
//       quizId,
//       userId: userName,
//       summary,
//       questions: completedQuiz,
//       score,
//       total
//     };

//     try {
//       const res = await fetch('http://localhost:5050/api/save-quiz', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error('Failed to save quiz result');

//       const result = await res.json();
//       alert('✅ Quiz submitted successfully!');
//       navigate('/'); // redirect to home or results page
//     } catch (err) {
//       console.error('Error submitting quiz:', err);
//       alert('❌ Failed to submit quiz.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!quiz.length) return <p>Loading quiz...</p>;

//   const currentQ = quiz[currentIndex];
//   const selected = selectedAnswers[currentIndex];

//   return (
//     <div style={{ maxWidth: '600px', margin: 'auto', padding: '2rem' }}>
//       <h2>Quiz for {userName}</h2>
//       <p><strong>Question {currentIndex + 1} of {quiz.length}:</strong></p>
//       <h3>{currentQ.question}</h3>
//       <ul style={{ listStyle: 'none', padding: 0 }}>
//         {currentQ.options.map((opt, i) => (
//           <li key={i}>
//             <button
//               onClick={() => handleOptionClick(opt)}
//               style={{
//                 margin: '0.5rem 0',
//                 padding: '0.75rem 1.5rem',
//                 backgroundColor: selected === opt ? '#4caf50' : '#eee',
//                 border: '1px solid #ccc',
//                 borderRadius: '5px',
//                 width: '100%',
//                 cursor: 'pointer',
//               }}
//             >
//               {opt}
//             </button>
//           </li>
//         ))}
//       </ul>

//       <button
//         onClick={handleNext}
//         disabled={isSubmitting}
//         style={{
//           marginTop: '1rem',
//           padding: '0.75rem 2rem',
//           backgroundColor: '#007bff',
//           color: 'white',
//           border: 'none',
//           borderRadius: '5px',
//           cursor: 'pointer'
//         }}
//       >
//         {currentIndex < quiz.length - 1 ? 'Next' : 'Submit'}
//       </button>
//     </div>
//   );
// };

// export default QuizRoom;
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io("http://localhost:5050"); // Backend URL

const QuizRoom = () => {
  const { quizId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const userName = location.state?.userName;

  const [quiz, setQuiz] = useState([]);
  const [summary, setSummary] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joinedUsers, setJoinedUsers] = useState([]);

  // Fetch quiz from backend
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`http://localhost:5050/api/get-quiz/${quizId}`);
        const data = await res.json();
        setQuiz(data.questions || []);
        setSummary(data.summary || '');
      } catch (err) {
        console.error('Failed to fetch quiz:', err);
        alert('Failed to load quiz.');
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Socket.IO real-time join
  useEffect(() => {
    if (!userName) return;

    socket.emit("join-quiz-room", { quizId, userName });

    socket.on("user-joined", ({ userName }) => {
      setJoinedUsers((prev) => {
        if (!prev.includes(userName)) return [...prev, userName];
        return prev;
      });
    });

    return () => {
      socket.off("user-joined");
    };
  }, [quizId, userName]);

  // Handle option selection
  const handleOptionClick = (option) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: option
    });
  };

  // Go to next question or submit if last
  const handleNext = () => {
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  // Submit quiz result to backend
  const handleSubmitQuiz = async () => {
    if (!userName) {
      alert('Username missing. Please go back and join again.');
      return;
    }

    setIsSubmitting(true);

    const completedQuiz = quiz.map((q, index) => ({
      ...q,
      selectedAnswer: selectedAnswers[index] || '',
    }));

    const correctAnswers = completedQuiz.filter(q => q.selectedAnswer === q.answer).length;
    const total = quiz.length;
    const score = correctAnswers;

    const payload = {
      quizId,
      userId: userName,
      summary,
      questions: completedQuiz,
      score,
      total
    };

    try {
      const res = await fetch('http://localhost:5050/api/save-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save quiz result');

      const result = await res.json();

      socket.emit("quiz-submitted", { quizId, userName, score });

      alert('✅ Quiz submitted successfully!');
      navigate('/'); // redirect to home or results page
    } catch (err) {
      console.error('Error submitting quiz:', err);
      alert('❌ Failed to submit quiz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!quiz.length) return <p>Loading quiz...</p>;

  const currentQ = quiz[currentIndex];
  const selected = selectedAnswers[currentIndex];

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '2rem' }}>
      <h2>Quiz for {userName}</h2>

      {/* Real-time joined users */}
      <div style={{ marginBottom: '1rem', background: '#f9f9f9', padding: '0.5rem', borderRadius: '5px' }}>
        <strong>Joined Users:</strong>
        <ul>
          {joinedUsers.map((user, idx) => (
            <li key={idx}>{user}</li>
          ))}
        </ul>
      </div>

      <p><strong>Question {currentIndex + 1} of {quiz.length}:</strong></p>
      <h3>{currentQ.question}</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {currentQ.options.map((opt, i) => (
          <li key={i}>
            <button
              onClick={() => handleOptionClick(opt)}
              style={{
                margin: '0.5rem 0',
                padding: '0.75rem 1.5rem',
                backgroundColor: selected === opt ? '#4caf50' : '#eee',
                border: '1px solid #ccc',
                borderRadius: '5px',
                width: '100%',
                cursor: 'pointer',
              }}
            >
              {opt}
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={handleNext}
        disabled={isSubmitting}
        style={{
          marginTop: '1rem',
          padding: '0.75rem 2rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        {currentIndex < quiz.length - 1 ? 'Next' : 'Submit'}
      </button>
    </div>
  );
};

export default QuizRoom;
