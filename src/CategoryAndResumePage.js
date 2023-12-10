import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBox from './ChatBox';
import ResumeUpload from './components/ResumeUpload.jsx';
import './CategoryAndResumePage.css'; // Import your custom styles

const CategoryAndResumePage = () => {
  const [messages, setMessages] = useState([]);
  const [transcript, setTranscript] = useState('');
  const [userSpeech, setUserSpeech] = useState('');
  const [isResumeUploaded, setIsResumeUploaded] = useState(false);
  const navigate = useNavigate();

  const handleUploadSuccess = () => {
    setIsResumeUploaded(true);
  };

  useEffect(() => {
    if (isResumeUploaded) {
      navigate('/interview');
    }
  }, [isResumeUploaded, navigate]);

  console.log("Category and Resume page is loading");

  return (
    <div className="category-and-resume-page">
      <img src={`${process.env.PUBLIC_URL}/AILOGO2.png`} alt="Logo" style={{ verticalAlign: 'middle', maxWidth: '50px', height: 'auto' }} />
      <h1>InterviewPrep AI</h1>
      <p>Select a category, upload your resume, and start the interview preparation!</p>

      <div className="chat-section">
        <ChatBox
          setTranscript={setTranscript}
          userSpeech={userSpeech}
          messages={messages}
          setMessages={setMessages}
          isResumeUploaded={isResumeUploaded}
        />
      </div>
      <br/>
      <div className="upload-section">
        <ResumeUpload setUserSpeech={setUserSpeech} onUploadSuccess={handleUploadSuccess} />
      </div>
    </div>
  );
};

export default CategoryAndResumePage;
