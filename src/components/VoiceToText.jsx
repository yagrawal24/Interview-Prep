import React, { useState, useRef, useEffect } from 'react';
import './VoiceToText.css';

// FOR NOW - TRANSCRIPT IS THE GPT RESPONSE INTO AUDIO, USERSPEECH IS THE SPEECH FROM USER GOING INTO GPT

const VoiceToText = ({ transcript, setTranscript, setUserSpeech }) => {
    const [isListening, setIsListening] = useState(false);
    const [audioFile, setAudioFile] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [finalSpeech, setFinalSpeech] = useState(null);

    useEffect(() => {
        if (transcript) {
          handleGenerateAudio();
          // HANDLE STOP BUT SPEECH RECOGNITION HAS ALREADY STARTED BS
          
        }
    }, [transcript]);

    useEffect(() => {
    if (isButtonDisabled) {
      const timeout = setTimeout(() => {
        setIsButtonDisabled(false);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isButtonDisabled]);

  useEffect(() => {
    console.log('is listening? ' + isListening);
    if(!isListening && finalSpeech != ''){
        setUserSpeech(finalSpeech); // puts non-null user speech into the userSpeech variable accessible to gpt
        setFinalSpeech('');
    }
  }, [isListening]);

    const recognitionRef = useRef(null); 

    const handleStop = () => {
        setIsListening(false);
        setIsButtonDisabled(true);
        if (recognitionRef.current) {
            recognitionRef.current.onresult = null;  
            recognitionRef.current.stop();
        }
    };

    const handleStart = () => {
        let finalSpeech = '';
        if(!isListening){
            if (window.SpeechRecognition || window.webkitSpeechRecognition) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                if (!recognitionRef.current) {
                    recognitionRef.current = new SpeechRecognition();
                    recognitionRef.current.continuous = true;
                    recognitionRef.current.interimResults = true;
                }

                setIsListening(true);
                recognitionRef.current.onstart = () => {};

                // automatically on api maybe you can stop the break up when pause
                // tricks to async waiting for state to update
                var speech = '';
                recognitionRef.current.onresult = (event) => {
                    for (let i = 0; i < event.results.length; i++) {
                        if (event.results[i].isFinal) {
                            const recentSpeech = event.results[i][0].transcript;
                            if(!speech.includes(recentSpeech)){
                                speech += recentSpeech;
                            }
                            setFinalSpeech(speech);
                            // console.log(finalSpeech);
                            // console.log(speech);
                        }
                    }
                };

                recognitionRef.current.onerror = (event) => {
                    console.error("Error occurred in recognition:", event.error);
                };

                recognitionRef.current.start();
            } else {
                alert("Your browser does not support the Web Speech API. Please try a different browser.");
            }
        }
    };
    

    const handleGenerateAudio = async () => {
        sendTranscriptToBackend(transcript);
       // handleStop();
    };

    const sendTranscriptToBackend = async (text) => {
        const backendUrl = 'http://127.0.0.1:5000/run_script';

        try {
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: text })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
            }

            const responseData = await response.json();
            console.log(responseData);
            setAudioFile(responseData.audio_file);

        } catch (error) {
            console.error('Error sending transcript to backend:', error);
        }
    };
    
    // const sendTranscriptToBackend = async (text) => {
    //     const apiUrl = "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM";
    //     const payload = {
    //         "text": text,
    //         "model_id": "eleven_monolingual_v1",
    //         "voice_settings": {
    //             "stability": 0,
    //             "similarity_boost": 0,
    //             "style": 0,
    //             "use_speaker_boost": true
    //         }
    //     };

    //     const headers = {
    //         "Content-Type": "application/json",
    //         "xi-api-key": "321547ec48256661cb0b640353bde72c"
    //     };

    //     try {
    //         const response = await fetch(apiUrl, {
    //             method: 'POST',
    //             headers: headers,
    //             body: JSON.stringify(payload)
    //         });

    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
    //         }

    //         const audioBlob = await response.blob();
    //         const audioUrl = URL.createObjectURL(audioBlob);
    //         setAudioFile(audioUrl);
    //         console.log('Response:', response);
    //         console.log('Audio Blob:', audioBlob);
    //         console.log('Audio URL:', audioUrl);

    //     } catch (error) {
    //         console.error('Error sending transcript to Eleven Labs:', error);
    //     }

    //     handleStop();
    // };

    return (
        <div>
            <button
                id="generate-audio-button"
                class={`voice-to-text-button ${isButtonDisabled ? 'disabled' : ''} ${isListening ? 'green' : 'red'}`}
                onClick={isListening ? handleStop : handleStart}
                disabled={isButtonDisabled}>
                <div class="mic-icon"></div>
            </button>
    
            {audioFile && (
                <div>
                    <h3>Your Generated Audio File:</h3>
                    <audio controls src={audioFile}>
                        Your browser does not support the audio tag.
                    </audio>
                </div>
            )}

            <div className="transcript-display">
                <p>{transcript}</p>
            </div>
        </div>
    );
    
};

export default VoiceToText;
