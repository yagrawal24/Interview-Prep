import React, {useState} from 'react';
import './Button.css';

function Button({setInterviewInProgress}) {
  // const [value, setValue] = useState()
  const handleEndInterview = () => {
    console.log("Ending Interview");
    setInterviewInProgress(false);
  };

  return (
    <button onClick={handleEndInterview}  type="button" className="custom-btn">
      End Interview
    </button>
  );
}

export default Button;
