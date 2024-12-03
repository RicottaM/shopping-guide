// import * as Speech from 'expo-speech';
// //import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
// import { useState, useRef } from 'react';

// export const useSpeechFlow = () => {
//   const [transcript, setTranscript] = useState('');
//   const transcriptRef = useRef('');
//   const isFinalRef = useRef(false);

//   useSpeechRecognitionEvent('result', (event) => {
//     if (event.results?.[0]?.transcript) {
//       const newTranscript = event.results[0].transcript.toLowerCase();
//       setTranscript(newTranscript);
//       transcriptRef.current = newTranscript;
//       if (event.isFinal) {
//         isFinalRef.current = true;
//       }
//     }
//   });

//   const speak = async (message: string): Promise<void> => {
//     return new Promise((resolve) => {
//       Speech.speak(message, {
//         language: 'en-US',
//         onDone: resolve,
//       });
//     });
//   };

//   const listen = async (): Promise<string> => {
//     try {
//       const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
//       if (!permission.granted) {
//         return '';
//       }

//       // Reset previous transcript and flags
//       transcriptRef.current = '';
//       isFinalRef.current = false;

//       await ExpoSpeechRecognitionModule.start({
//         lang: 'en-US',
//         interimResults: false,
//         continuous: false,
//       });

//       return new Promise<string>((resolve) => {
//         const timeoutId = setTimeout(() => {
//           ExpoSpeechRecognitionModule.stop();
//           resolve('');
//         }, 7000);

//         const intervalId = setInterval(() => {
//           if (isFinalRef.current && transcriptRef.current) {
//             clearTimeout(timeoutId);
//             clearInterval(intervalId);
//             ExpoSpeechRecognitionModule.stop();
//             resolve(transcriptRef.current);
//           }
//         }, 100);
//       });
//     } catch {
//       return '';
//     }
//   };

//   return { speak, listen };
// };
