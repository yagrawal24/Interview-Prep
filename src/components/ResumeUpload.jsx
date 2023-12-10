// ResumeUpload.jsx

import React, { useState, useRef, useEffect } from 'react';
import mammoth from 'mammoth';
import './ResumeUpload.css'; // Import your custom styles

const ResumeUpload = ({ setUserSpeech, onUploadSuccess }) => {
  const [docxFile, setDocxFile] = useState(null);
  const [docxText, setDocxText] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      setDocxFile(file);
      const reader = new FileReader();

      reader.onload = (e) => {
        const arrayBuffer = e.target.result;

        mammoth.extractRawText({ arrayBuffer: arrayBuffer })
          .then((result) => {
            setDocxText(result.value);
          })
          .catch((error) => {
            console.error('Error parsing .docx file:', error);
          });
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = () => {
    console.log(docxText);
    //alert('Text data is logged to the console.');
    setUserSpeech(docxText);
    onUploadSuccess(); // Call the callback after successful upload
  };

  console.log("Resume upload page is loading");

  return (
    <div className="resume-upload-container">
      <label htmlFor="resume-upload-input" className="upload-label">
        <input
          type="file"
          id="resume-upload-input"
          accept=".docx"
          onChange={handleFileChange}
          className="file-input"
        />
        <span className="upload-button">Upload Resume (.docx)</span>
      </label>

      {docxFile && (
        <div className="submit-section">
          <button onClick={handleSubmit} className="submit-button">
            Submit Document
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
