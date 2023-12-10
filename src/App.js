import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CategoryAndResumePage from './CategoryAndResumePage';
import InterviewPage from './InterviewPage';
import './App.css';

// Import other components or pages if necessary

function App() {
  console.log("App is loading");
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Define the route for the Category and Resume page */}
          <Route exact path="/" element={<CategoryAndResumePage />} />

          {/* Define the route for the Interview page */}
          <Route path="/interview" element={<InterviewPage />} />

          {/* You can add more routes for other components or pages here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

