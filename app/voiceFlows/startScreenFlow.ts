import { Screens } from '../enum/screens';

export const startScreenFlow = (handleRouteChange: any, username: string) => ({
  intro: {
    message: 'Welcome to the Shopper app. You are currently on the start screen.',
    next: 'promptStart',
  },
  promptStart: {
    message: 'Say "start" to begin.',
    options: [
      {
        command: 'start',
        next: 'handleStart',
      },
    ],
    onFailure: 'handleUnknownCommand',
    onSilence: 'handleSilence',
  },
  handleStart: {
    message: 'Got it, moving forward.',
    action: () => {
      if (username) {
        handleRouteChange(Screens.Categories);
      } else {
        handleRouteChange(Screens.Login);
      }
    },
  },
  handleUnknownCommand: {
    message: 'Unknown command. The available option is: "start".',
    repeat: 'promptStart',
  },
  handleSilence: {
    message: 'I did not hear you. Please repeat.',
    repeat: 'promptStart',
  },
});
