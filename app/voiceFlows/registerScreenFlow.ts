// LOGINSCREENFLOW.TS
import { Screens } from '../enum/screens';

const replaceAtSynonyms = (input: string): string => {
  const atSynonyms = ['at', 'add', 'other', 'symbol at', 'arobase', 'arroba'];
  const regex = new RegExp(`\\b(${atSynonyms.join('|')})\\b`, 'gi');
  return input.replace(regex, '@');
};

export const registerScreenFlow = (
  handleRouteChange: any,
  registerUser: (email: string, password: string, firstname: string, lastname: string) => Promise<boolean>
) => ({
  intro: {
    message: `You are on the register panel. Say 'register' to sign up or 'login' to go back to the sign in page.`,
    options: [
      {
        command: 'register',
        next: 'promptFirstname',
      },
      {
        command: 'login',
        next: 'promptLogin',
      },
    ],
    onSilence: 'handleIntroSilence',
    onFailure: 'handleUnknownCommand',
  },
  handleStart: {
    options: [
      {
        command: 'register',
        next: 'promptFirstname',
      },
      {
        command: 'login',
        next: 'promptLogin',
      },
    ],
    onSilence: 'handleIntroSilence',
    onFailure: 'handleUnknownCommand',
  },
  handleUnknownCommand: {
    message: 'I did not understand your command. Try again.',
    next: 'handleStart',
  },
  handleIntroSilence: {
    message: `I did not hear you. Say 'register' to sign up or 'login' to go back to the sign in page.`,
    repeat: 'handleStart',
  },
  promptLogin: {
    message: 'Moving to login',
    action: () => handleRouteChange(Screens.Login),
  },
  promptFirstname: {
    message: 'Please provide your first name at least 3 characters long',
    onResponse: 'confirmFirstname',
    onResponseKey: 'firstname',
    onSilence: 'handleFirstnameSilence',
  },
  handleFirstnameSilence: {
    message: 'I did not hear you.',
    repeat: 'promptFirstname',
  },
  confirmFirstname: {
    message: (context: any) => `I understood: ${context.firstname}. Is that correct? Say "yes" or "no".`,
    options: [
      {
        command: 'yes',
        next: 'promptLastname',
      },
      {
        command: 'no',
        next: 'promptFirstname',
      },
    ],
    onFailure: 'handleFirstnameConfirmationUnknown',
    onSilence: 'handleFirstnameConfirmationSilence',
  },
  handleFirstnameConfirmationUnknown: {
    message: 'I did not understand your response.',
    repeat: 'confirmFirstname',
  },
  handleFirstnameConfirmationSilence: {
    message: 'I did not hear you.',
    repeat: 'confirmFirstname',
  },
  promptLastname: {
    message: 'Please provide your Lastname at least 3 characters long',
    onResponse: 'confirmLastname',
    onResponseKey: 'lastname',
    onSilence: 'handleLastnameSilence',
  },
  handleLastnameSilence: {
    message: 'I did not hear you.',
    repeat: 'promptLastname',
  },
  confirmLastname: {
    message: (context: any) => `I understood: ${context.lastname}. Is that correct? Say "yes" or "no".`,
    options: [
      {
        command: 'yes',
        next: 'promptEmail',
      },
      {
        command: 'no',
        next: 'promptLastname',
      },
    ],
    onFailure: 'handleLastnameConfirmationUnknown',
    onSilence: 'handleLastnameConfirmationSilence',
  },
  handleLastnameConfirmationUnknown: {
    message: 'I did not understand your response.',
    repeat: 'confirmLastname',
  },
  handleLastnameConfirmationSilence: {
    message: 'I did not hear you.',
    repeat: 'confirmLastname',
  },
  promptEmail: {
    message: 'Please provide a valid email address.',
    onResponse: 'confirmEmail',
    onResponseKey: 'login',
    onSilence: 'handleEmailSilence',
  },
  confirmEmail: {
    message: (context: any) => `I understood: ${context.login}. Is that correct? Say "yes" or "no".`,
    options: [
      {
        command: 'yes',
        next: 'promptPassword',
      },
      {
        command: 'no',
        next: 'promptEmail',
      },
    ],
    onFailure: 'handleEmailConfirmationUnknown',
    onSilence: 'handleEmailConfirmationSilence',
  },
  handleEmailSilence: {
    message: 'I did not hear you.',
    repeat: 'promptEmail',
  },
  handleEmailConfirmationUnknown: {
    message: 'I did not understand your response. Say "yes" if the email is correct, or "no" to try again.',
    repeat: 'confirmEmail',
  },
  handleEmailConfirmationSilence: {
    message: 'I did not hear your response. Say "yes" if the email is correct, or "no" to try again.',
    repeat: 'confirmEmail',
  },
  promptPassword: {
    message: 'Provide your password at least 8 characters long.',
    onResponse: 'confirmPassword',
    onResponseKey: 'password',
    onSilence: 'handlePasswordSilence',
  },
  confirmPassword: {
    message: (context: any) => `I understood: ${context.password}. Is that correct? Say "yes" or "no".`,
    options: [
      {
        command: 'yes',
        next: 'attemptRegister',
      },
      {
        command: 'no',
        next: 'promptPassword',
      },
    ],
    onFailure: 'handlePasswordConfirmationUnknown',
    onSilence: 'handlePasswordConfirmationSilence',
  },
  handlePasswordSilence: {
    message: 'I did not hear you.',
    repeat: 'promptPasswordEntry',
  },
  handlePasswordConfirmationUnknown: {
    message: 'I did not understand your response. Say "yes" if the password is correct, or "no" to try again.',
    repeat: 'confirmPassword',
  },
  handlePasswordConfirmationSilence: {
    message: 'I did not hear your response. Say "yes" if the password is correct, or "no" to try again.',
    repeat: 'confirmPassword',
  },
  attemptRegister: {
    message: 'Attempting to sign you up.',
    action: async (context: any) => {
      console.log(context);
      const success = await registerUser(context.login, context.firstname, context.lastname, context.password);
      if (success) {
        return 'registerSuccess';
      } else {
        return 'registerFailure';
      }
    },
  },
  registerSuccess: {
    message: 'Registration successful. Redirecting you to the categories page.',
    action: () => {
      handleRouteChange(Screens.Categories);
    },
  },
  registerFailure: {
    message:
      "Registration failed. Remember that Firstname and Lastname must be at least 3 characters long. Password must be at least 8 characters long. Email must be a valid email address. Let's try again.",
    action: (context: any) => {
      context.email = '';
      context.password = '';
      context.lastname = '';
      context.firstname = '';
      return 'promptFirstname';
    },
  },
});
