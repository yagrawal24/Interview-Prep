import React, { useState, useEffect } from "react";
import { sendMessageToAI } from "../utils/GptAPI";
import styled from 'styled-components';

const StyledResponse = styled.div`
border: 1px solid #ddd;
border-radius: 8px;
font-size: 16px;
line-height: 1.5;
text-align: left; 
color: #333;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  color: #333;
`;

const SectionContent = styled.div`
  color: #333;

`;


const Evaluation = ({ messages }) => {
  const [gptMessages, setGptMessages] = useState("");

  useEffect(() => {
    const createTranscript = (messages) => {
      return messages.slice(1).map((msg) => `${msg.role}: ${msg.content}`).join('\n');
    };

    const fetchEvaluation = async () => {
      const transcript = createTranscript(messages);

      const initialContext = {
        role: "system",
        content: "You are a lead software engineer at a major tech company." +
        " You are being given a transcript from a recent interview between a software developer at your company and a candidate for a Software Engineering role." +
        " Evaluate the candidate based on 8 factors: Motivation, Ability to be Proactive, Able to work in an unstructured environment, Perseverance, Conflict Resolution, Empathy, Growth, and Communication." +
        " You are ONLY EVALUATING the USER." + 
        " Give scores ranging from 1-10 for each factor, where 1 represents poor showing of this element in their answers and 10 represents amazing representation of this element in their answers." + 
        " If there was not enough data to evaluate the candidate for a certain element, say \"Not Enough Data\"" + 
        " After evaluationg, give one paragraph on what was GENUINELY done well in their answers." +
        " Give one more paragraph on what needs improving in their answers."
      };

      const interviewTranscript = {
        role: "user",
        content: transcript
      };

      console.log([initialContext, interviewTranscript])

      // Now call the API and wait for the response before setting the state
      const response = await gptCall([initialContext, interviewTranscript]);
      if (response) { // Make sure there's a response before setting state
        setGptMessages(response);
        console.log(response)
      }
    };
    if (gptMessages === "") {
      fetchEvaluation();
    }
  }, []);

  const formatResponse = (response) => {
    const responseParts = response.split('\n\n');
    return responseParts.map((part, index) => (
      <SectionContent key={index}>
        {part}
      </SectionContent>
    ));
  };

  const gptCall = async (newMessages) => {
    try {
      const responseText = await sendMessageToAI(newMessages, 'gpt-4-1106-preview', 500);
      return responseText;
    } catch (error) {
      console.error('Error:', error);
      return "";
    }
  };

  return (
    <StyledResponse>
      {gptMessages && formatResponse(gptMessages).map((section, index) => (
        <div key={index}>
          {/* <SectionTitle>Section {index + 1}</SectionTitle> */}
          <h1>   </h1>
          {section}
        </div>
      ))}
    </StyledResponse>
  );
};

export default Evaluation;
