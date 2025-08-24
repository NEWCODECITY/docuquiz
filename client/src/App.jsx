
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadForm from './components/UploadForm';
import JoinQuiz from './components/JoinQuiz';
import QuizRoom from './components/QuizRoom'; // This is the main quiz playing UI

function App() {
  return (
    <Router>
      <Routes>
        {/* Homepage to upload PDF and generate quiz */}
        <Route path="/" element={<UploadForm />} />

        {/* Route to join quiz with user name and fetch quiz */}
        <Route path="/join/:quizId" element={<JoinQuiz />} />

        {/* Route to play the quiz (userName & quiz passed via state) */}
        <Route path="/quiz/:quizId" element={<QuizRoom />} />
      </Routes>
    </Router>
  );
}

export default App;

