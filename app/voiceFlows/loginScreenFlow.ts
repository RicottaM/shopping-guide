// LOGINSCREENFLOW.TS
import { Screens } from '../enum/screens';

export const loginScreenFlow = (
    handleRouteChange: any,
    loginUser: (email: string, password: string) => Promise<boolean>
) => ({
    intro: {
        message: 'Znajdujesz się w panelu logowania.',
        next: 'promptEmail',
    },
    promptEmail: {
        message: 'Proszę podaj swój adres email, literując go wyraźnie.',
        onResponse: 'confirmEmail',
        onResponseKey: 'email',
        onSilence: 'handleEmailSilence',
    },
    confirmEmail: {
        message: (context: any) => `Zrozumiałem: ${context.email}. Czy to poprawne? Powiedz "tak" lub "nie".`,
        options: [
            {
                command: 'tak',
                next: 'promptPassword',
            },
            {
                command: 'nie',
                next: 'promptEmailAgain',
            },
        ],
        onFailure: 'handleEmailConfirmationUnknown',
        onSilence: 'handleEmailConfirmationSilence',
    },
    promptEmailAgain: {
        message: 'Proszę podaj swój adres email ponownie, literując go wyraźnie.',
        onResponse: 'confirmEmail',
        onResponseKey: 'email',
        onSilence: 'handleEmailSilence',
    },
    handleEmailSilence: {
        message: 'Nie usłyszałem Cię.',
        repeat: 'promptEmail',
    },
    handleEmailConfirmationUnknown: {
        message: 'Nie zrozumiałem odpowiedzi. Powiedz "tak", jeśli adres jest poprawny, lub "nie", aby spróbować ponownie.',
        repeat: 'confirmEmail',
    },
    handleEmailConfirmationSilence: {
        message: 'Nie usłyszałem odpowiedzi. Powiedz "tak", jeśli adres jest poprawny, lub "nie", aby spróbować ponownie.',
        repeat: 'confirmEmail',
    },
    promptPassword: {
        message: 'Podaj swoje hasło, literując je wyraźnie.',
        onResponse: 'confirmPassword',
        onResponseKey: 'password',
        onSilence: 'handlePasswordSilence',
    },
    passwordPrivacyWarning: {
        message:
            'Uwaga, hasło może zostać usłyszane przez osoby postronne. Czy chcesz, abym powtórzył je na głos dla potwierdzenia? Powiedz "tak" lub "nie".',
        options: [
            {
                command: 'tak',
                next: 'promptPasswordEntry',
            },
            {
                command: 'nie',
                next: 'attemptLoginWithoutPasswordConfirmation',
            },
        ],
        onFailure: 'handlePasswordPrivacyUnknown',
        onSilence: 'handlePasswordPrivacySilence',
    },
    handlePasswordPrivacyUnknown: {
        message:
            'Nie zrozumiałem odpowiedzi. Powiedz "tak", jeśli chcesz, abym powtórzył hasło na głos, lub "nie", aby zalogować się bez powtarzania.',
        repeat: 'passwordPrivacyWarning',
    },
    handlePasswordPrivacySilence: {
        message:
            'Nie usłyszałem odpowiedzi. Powiedz "tak", jeśli chcesz, abym powtórzył hasło na głos, lub "nie", aby zalogować się bez powtarzania.',
        repeat: 'passwordPrivacyWarning',
    },
    promptPasswordEntry: {
        message: 'Proszę podaj swoje hasło ponownie, literując je wyraźnie.',
        onResponse: 'confirmPassword',
        onResponseKey: 'password',
        onSilence: 'handlePasswordSilence',
    },
    confirmPassword: {
        message: (context: any) => `Zrozumiałem: ${context.password}. Czy to poprawne? Powiedz "tak" lub "nie".`,
        options: [
            {
                command: 'tak',
                next: 'attemptLogin',
            },
            {
                command: 'nie',
                next: 'promptPasswordEntry',
            },
        ],
        onFailure: 'handlePasswordConfirmationUnknown',
        onSilence: 'handlePasswordConfirmationSilence',
    },
    handlePasswordSilence: {
        message: 'Nie usłyszałem hasła. Proszę podaj swoje hasło ponownie, literując je wyraźnie.',
        repeat: 'promptPasswordEntry',
    },
    handlePasswordConfirmationUnknown: {
        message:
            'Nie zrozumiałem odpowiedzi. Powiedz "tak", jeśli hasło jest poprawne, lub "nie", aby spróbować ponownie.',
        repeat: 'confirmPassword',
    },
    handlePasswordConfirmationSilence: {
        message:
            'Nie usłyszałem odpowiedzi. Powiedz "tak", jeśli hasło jest poprawne, lub "nie", aby spróbować ponownie.',
        repeat: 'confirmPassword',
    },
    attemptLogin: {
        message: 'Próbuję Cię zalogować.',
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
        message: 'Rozumiem. Próbuję Cię zalogować.',
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
        message: 'Logowanie powiodło się. Przekierowuję Cię do strony kategorii.',
        action: () => {
            handleRouteChange(Screens.Categories);
        },
    },
    loginFailure: {
        message: 'Logowanie nie powiodło się. Spróbujmy jeszcze raz.',
        action: (context: any) => {
            // Reset context variables
            context.email = '';
            context.password = '';
            return 'promptEmail';
        },
    },
});