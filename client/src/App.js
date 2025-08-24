import React from "react";
import { Routes, Route } from "react-router-dom";
import UploadForm from "./components/UploadForm";
import JoinQuiz from "./components/JoinQuiz";

function App() {
  return (
    <Routes>
      {/* Home - upload PDF and create quiz */}
      <Route path="/" element={<UploadForm />} />

      {/* Join quiz via link */}
      <Route path="/join/:quizId" element={<JoinQuiz />} />
    </Routes>
  );
}

export default App;
