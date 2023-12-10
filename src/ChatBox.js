import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { sendMessageToAI } from './utils/GptAPI';
//import VoiceToText, { sendTranscriptToBackend } from './components/VoiceToText.jsx';

const ChatBox = ({ setTranscript, userSpeech, messages, setMessages, isResumeUploaded }) => {
  const [newMessage, setNewMessage] = useState('');
//  const [timer, setTimer] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();
  var responses = 0;

  // The categories mapping
const categories = {
  "Motivation": "We want to know what drives them? Ideal candidates are self-motivated, passionate about technologies and products that have a real impact.",
  "Ability to be Proactive": "Are they able to take initiative? Given a difficult problem, are they able to figure out how to get it done and execute?",
  "Able to work in an unstructured environment": "How well are they able to take ownership in ambiguous situations? Or do they rely on others to be told what to do?",
  "Perseverance": "Are they able to push through difficult problems or blockers?",
  "Conflict Resolution and Empathy": "How well are they able to handle and work through challenging relationships? How well are they able to see things from the perspective of others and understand their motivations?",
  "Growth": "How well do they understand their strengths, weaknesses, and growth areas? Are they making a continued effort to grow?",
  "Communication": "Are they able to clearly communicate their stories during the interview? Generally covered during the interview as to how clearly they are explaining the stories. There is also some overlap with Empathy and how they communicate with others."
};

// Example questions and answers for each category
const exampleQuestionsAndAnswers = {
  "Motivation": {
    "Example Questions":
      "“What project are you most proud of and why?”\n“Tell me about a recent day working that was really great and/or fun.”",
    "Example Responses":
      "Junior: A story about a project they are proud of that had an impact on their team.\nSenior: A story about a project they are proud of that had a large impact on their team.\nStaff: A story about a project they are proud of that had a large impact on their org."
  },
  "Ability to be Proactive": {
    "Example Questions":
      "“Tell me about a time when you wanted to change something that was outside of your regular scope of work.”\n“Tell me about a time you had to make a fast decision and live with the results.”",
    "Example Responses":
      "Junior: A story about a change they proactively suggested and drove that had an impact on their team’s focus area. Usually only requiring the candidate themselves to work on.\nSenior: A story about a change they proactively suggested and drove that had an impact on their entire team. Usually requiring three or more people to work on.\nStaff: A story about a change they proactively suggested and drove that had an impact on their entire org. Usually requiring two or more teams to work on."
  },
  "Able to work in an unstructured environment": {
    "Example Questions":
      "“How do you decide what to work on next?”\n“Tell me about a project or task that was ambiguous or underspecified.”",
    "Example Responses":
      "Junior: A story about an ambiguous task that the candidate took ownership of and was able to drive consensus from a few stakeholders in their team. Usually only requiring the candidate themselves to work on.\nSenior: A story about an ambiguous project that the candidate took ownership of and was able to drive consensus from stakeholders in their team or org. Usually requiring three or more people to work on.\nStaff: A story about an ambiguous project that the candidate took ownership of and was able to drive consensus from stakeholders in their org. Usually requiring two or more teams to work on."
  },
  "Perseverance": {
    "Example Questions":
      "“Tell me about a time when you needed to overcome external obstacles to complete” a task or project.\n“Tell me about a time a project took longer as expected.”",
    "Example Responses":
      "Junior: A story about a task with many technical difficulties and how they overcame each blocker.\nSenior: A story about a project with many technical difficulties that were blocking their team and how they overcame each blocker.\nStaff: A story about a project with many technical difficulties that were blocking many teams and how they overcame each blocker."
  },
  "Conflict Resolution and Empathy": {
    "Example Questions":
      "“Tell me about a person or team who you found most challenging to work with.”\n“Tell me about a time you disagreed with a coworker.”\n“Tell me about a situation where two teams couldn’t agree on a path forward.”",
    "Example Responses":
      "Junior: A story about how they were able to work through a disagreement with a coworker on an implementation detail of a larger project.\nSenior: A story about how they were able to work through a disagreement with a few coworkers or team leads on the direction of a larger project.\nStaff: A story about how they were able to work through a disagreement with two or more teams on the direction of a large project."
  },
  "Growth": {
    "Example Questions":
      "“Describe a situation when you made a mistake, and what you learned from it.”\n“Tell me about some constructive feedback you received from a manager or a peer”\n“Tell me about a skill set that you observed in a peer or mentor that you want to develop in the next six months.”",
    "Example Responses":
      "Junior: A story about a new technology they want to learn and the progress they have made to learn it.\nSenior: A story about a soft skill or technical skill they want to develop and the progress they have made to learn it. Usually a skill that will have the potential to affect the entire team.\nStaff: A story about a soft skill or technical skill they want to develop and the progress they have made to learn it. Usually a skill that will have the potential to affect two or more teams."
  },
  "Communication": {
    "Example Questions": "Generally covered during the interview as to how clearly they are explaining the stories. There is also some overlap with Empathy and how they communicate with others."
  }
};

// Example usage:
//console.log(categories["Motivation"]); // Output the description for the "Motivation" category
//console.log(exampleQuestionsAndAnswers["Motivation"]["Example Questions"]); // Output the example questions for the "Motivation" category

  
/*useEffect(() => {
  const interval = setInterval(() => {
    setTimer((prevTimer) => prevTimer + 1);
  }, 1000);

  return () => clearInterval(interval);
}, []);*/

  useEffect(() => {
    if (userSpeech) {
      // Automatically click the button when userSpeech is not empty
      console.log('user speech in gpt: ' + userSpeech);
      responses++;
      setNewMessage(userSpeech);
    }
  }, [userSpeech]);
  
  useEffect(() => {
    // Only call handleSendMessage when newMessage changes
    if (newMessage) {
      console.log('new message in gpt: ' + newMessage);
      handleSendMessage();
    }
  }, [newMessage]);

  useEffect(() => {
    const initialContext = {
      "role": "system",
      "content": getInitialContext()
    };
    gptCall([initialContext]); 
  }, []);

  useEffect(() => {
    // Check if a category is selected and resume is uploaded
    if (selectedCategory && isResumeUploaded) {
      // Navigate to the /interview route
      navigate('/interview');  // For React Router v5
      // navigate('/interview'); // For React Router v6
    }
  }, [selectedCategory, isResumeUploaded, navigate]); // Add navigate to the dependency array for React Router v6


  // Define the base part of the initial context
  const baseContext = "You are an interview for a major Software Engineering company. " +
    "You are here today to assess the user on their behavior through a behavioral test. ONLY act as the interviewer and AWAIT THEIR MESSAGE. " +
    "Start with asking their introduction. No need to say you are the interviewer, we know. " +
    "When you are interacting with the candidate, please act empathetic but firm in your questions. " +
    "If the candidate's answer is inappropriate, please feel free to either remind them they are in an interview or thank them for their time. " +
    "If the candidate's answer is great, please feel free to strike a happier tone with them. " +
    "Last reminder: You are here today to assess the user on their behavior through a behavioral test. ONLY act as the interviewer and AWAIT THEIR MESSAGE." +
    "You will be assessing the candidate on their general communication skills. Are they able to clearly communicate their stories during the interview? Generally covered during the interview as to how clearly they are explaining the stories. There is also some overlap with Empathy and how they communicate with others.";

    // Build the initial context based on the selected category
  const getInitialContext = () => {
    let additionalContext = "The main focus area you will assess is their " + selectedCategory + ". " + categories[selectedCategory] + exampleQuestionsAndAnswers[selectedCategory] || '';
    return baseContext + additionalContext;
  };

  const gptCall = async (newMessages) => {
    try {
      const responseText = await sendMessageToAI(newMessages, 'gpt-3.5-turbo', 100);
      setMessages([...newMessages, { "role": "assistant", "content": responseText }]);
      console.log(messages);

      setTranscript(responseText);

      document.getElementById('generate-audio-button').click();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const updatedMessages = [...messages, { "role": "user", "content": newMessage }];
      gptCall(updatedMessages);
      setNewMessage('');
    }
  };

  console.log("Chatbox is loading");

  return (
    <div>
      <div className="chat-container" hidden>
        {messages.map((message, index) => (
          <div key={index} className={message.role === "user" ? 'user-message' : 'ai-message'}>
            {message.content}
          </div>
        ))}
      </div>

      <select value={selectedCategory} 
              onChange={e => setSelectedCategory(e.target.value)}
              style={{
                padding: '8px',
                fontSize: '16px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}>
        <option value="">Select a category</option>
        {Object.keys(categories).map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>



    </div>
  );
};

/*<div style={{ position: 'absolute', top: 10, right: 10, color: 'white' }}>
        <p>{Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}</p>
      </div>*/

export default ChatBox;
