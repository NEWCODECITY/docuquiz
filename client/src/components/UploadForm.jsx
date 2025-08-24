
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const UploadForm = () => {
//   const navigate = useNavigate();

//   const [file, setFile] = useState(null);
//   const [summary, setSummary] = useState('');
//   const [quiz, setQuiz] = useState([]);
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [score, setScore] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [quizLoading, setQuizLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [submitted, setSubmitted] = useState(false);
//   const [generatedQuizId, setGeneratedQuizId] = useState(null);

//   const resetState = () => {
//     setQuiz([]);
//     setSelectedAnswers({});
//     setScore(null);
//     setError('');
//     setSubmitted(false);
//     setGeneratedQuizId(null);
//   };

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     resetState();
//     setSummary('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) return alert('Please select a file.');

//     setLoading(true);
//     const formData = new FormData();
//     formData.append('pdf', file);

//     try {
//       const res = await fetch('http://localhost:5050/api/summarize', {
//         method: 'POST',
//         body: formData,
//       });
//       if (!res.ok) throw new Error('Failed to summarize PDF');
//       const data = await res.json();
//       setSummary(data.summary);
//     } catch (err) {
//       console.error('Error:', err);
//       setError('Error summarizing PDF.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGenerateQuiz = async (e) => {
//     e.preventDefault();
//     if (!summary) return;
//     setQuizLoading(true);
//     setError('');
//     setQuiz([]);
//     setSelectedAnswers({});

//     try {
//       const res = await fetch('http://localhost:5050/api/generate-quiz', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ summary }),
//       });

//       if (!res.ok) throw new Error('Failed to generate quiz');

//       const data = await res.json();
//       const { quiz, quizId } = data;

//       const parsedQuiz = typeof quiz === 'string' ? JSON.parse(quiz) : quiz;
//       if (!Array.isArray(parsedQuiz)) throw new Error('Invalid quiz format');

//       setQuiz(parsedQuiz);
//       setGeneratedQuizId(quizId);

//       // Redirect to join page (users will enter name there)
//       navigate(`/join/${quizId}`);
//     } catch (err) {
//       console.error('Quiz generation error:', err);
//       setError('Quiz generation failed.');
//     } finally {
//       setQuizLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
//       >
//         <h2 className="text-2xl font-bold">Upload a PDF</h2>

//         <input
//           type="file"
//           accept="application/pdf"
//           onChange={handleFileChange}
//           className="w-full text-sm p-2 border rounded-md"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
//         >
//           {loading ? 'Processing...' : 'Extract & Summarize'}
//         </button>

//         {error && <p className="text-red-500">{error}</p>}
//       </form>

//       {summary && (
//         <div className="mt-6 bg-white p-4 shadow rounded w-full max-w-2xl">
//           <h3 className="font-semibold mb-2">Summary</h3>
//           <p>{summary}</p>
//         </div>
//       )}

//       {summary && (
//         <button
//           onClick={handleGenerateQuiz}
//           disabled={quizLoading}
//           className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
//         >
//           {quizLoading ? 'Generating...' : 'Generate Quiz'}
//         </button>
//       )}
//     </div>
//   );
// };

// export default UploadForm;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadForm = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSummary('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file.');
    setLoading(true);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await fetch('http://localhost:5050/api/summarize', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to summarize PDF');
      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      setError('Error summarizing PDF.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!summary) return;
    setQuizLoading(true);
    try {
      const res = await fetch('http://localhost:5050/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary }),
      });
      if (!res.ok) throw new Error('Failed to generate quiz');
      const data = await res.json();
      navigate(`/join/${data.quizId}`);
    } catch (err) {
      setError('Quiz generation failed.');
    } finally {
      setQuizLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-700">📄 Upload a PDF</h2>

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full text-sm p-2 border border-gray-300 rounded-md"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? 'Processing...' : 'Extract & Summarize'}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>

      {summary && (
        <div className="mt-6 bg-white p-4 rounded-xl shadow-md w-full max-w-2xl">
          <h3 className="font-semibold mb-2">Summary</h3>
          <p className="text-gray-600">{summary}</p>
        </div>
      )}

      {summary && (
        <button
          onClick={handleGenerateQuiz}
          disabled={quizLoading}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          {quizLoading ? 'Generating...' : 'Generate Quiz'}
        </button>
      )}
    </div>
  );
};

export default UploadForm;
