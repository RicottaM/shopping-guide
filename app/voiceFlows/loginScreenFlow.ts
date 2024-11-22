// LOGINSCREENFLOW.TS
import { Screens } from '../enum/screens';

export const loginScreenFlow = (handleRouteChange: any, loginUser: (email: string, password: string) => Promise<boolean>) => ({
  intro: {
    message: 'You are on the login panel.',
    next: 'promptEmail',
  },
  promptEmail: {
    message: 'Please provide your email address, spelling it clearly.',
    onResponse: 'confirmEmail',
    onResponseKey: 'email',
    onSilence: 'handleEmailSilence',
  },
  confirmEmail: {
    message: (context: any) => `I understood: ${context.email}. Is that correct? Say "yes" or "no".`,
    options: [
      {
        command: 'yes',
        next: 'promptPassword',
      },
      {
        command: 'no',
        next: 'promptEmailAgain',
      },
    ],
    onFailure: 'handleEmailConfirmationUnknown',
    onSilence: 'handleEmailConfirmationSilence',
  },
  promptEmailAgain: {
    message: 'Please provide your email address again, spelling it clearly.',
    onResponse: 'confirmEmail',
    onResponseKey: 'email',
    onSilence: 'handleEmailSilence',
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
    message: 'Provide your password, spelling it clearly.',
    onResponse: 'confirmPassword',
    onResponseKey: 'password',
    onSilence: 'handlePasswordSilence',
  },
  passwordPrivacyWarning: {
    message: 'Warning: the password may be heard by others nearby. Do you want me to repeat it aloud for confirmation? Say "yes" or "no".',
    options: [
      {
        command: 'yes',
        next: 'promptPasswordEntry',
      },
      {
        command: 'no',
        next: 'attemptLoginWithoutPasswordConfirmation',
      },
    ],
    onFailure: 'handlePasswordPrivacyUnknown',
    onSilence: 'handlePasswordPrivacySilence',
  },
  handlePasswordPrivacyUnknown: {
    message: 'I did not understand your response. Say "yes" if you want me to repeat the password aloud, or "no" to log in without repeating.',
    repeat: 'passwordPrivacyWarning',
  },
  handlePasswordPrivacySilence: {
    message: 'I did not hear your response. Say "yes" if you want me to repeat the password aloud, or "no" to log in without repeating.',
    repeat: 'passwordPrivacyWarning',
  },
  promptPasswordEntry: {
    message: 'Please provide your password again, spelling it clearly.',
    onResponse: 'confirmPassword',
    onResponseKey: 'password',
    onSilence: 'handlePasswordSilence',
  },
  confirmPassword: {
    message: (context: any) => `I understood: ${context.password}. Is that correct? Say "yes" or "no".`,
    options: [
      {
        command: 'yes',
        next: 'attemptLogin',
      },
      {
        command: 'no',
        next: 'promptPasswordEntry',
      },
    ],
    onFailure: 'handlePasswordConfirmationUnknown',
    onSilence: 'handlePasswordConfirmationSilence',
  },
  handlePasswordSilence: {
    message: 'I did not hear your password. Please provide your password again, spelling it clearly.',
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
  attemptLogin: {
    message: 'Attempting to log you in.',
    action: async (context: any) => {
      const success = await loginUser(context.email, context.password);
      if (success) {
        return 'loginSuccess';
      } else {
        return 'loginFailure';
      }
    },
  },
  attemptLoginWithoutPasswordConfirmation: {
    message: 'Understood. Attempting to log you in.',
    action: async (context: any) => {
      const success = await loginUser(context.email, context.password);
      if (success) {
        return 'loginSuccess';
      } else {
        return 'loginFailure';
      }
    },
  },
  loginSuccess: {
    message: 'Login successful. Redirecting you to the categories page.',
  },
  loginFailure: {
    message: "Login failed. Let's try again.",
    action: (context: any) => {
      // Reset context variables
      context.email = '';
      context.password = '';
      return 'promptEmail';
    },
  },
});
