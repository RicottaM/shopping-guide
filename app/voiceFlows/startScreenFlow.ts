// STARTSCREENFLOW.TS CONTEXT (Updated to use backticks for interpolation if needed)
import { Screens } from "../enum/screens";

export const startScreenFlow = (handleRouteChange: any, username: string) => ({
    intro: {
        message: 'Witaj w aplikacji Shopper. Znajdujesz się na ekranie startowym.',
        next: 'promptStart',
    },
    promptStart: {
        message: 'Powiedz "rozpocznij", aby skorzystać z aplikacji.',
        options: [
            {
                command: 'rozpocznij',
                next: 'handleStart',
            },
        ],
        onFailure: 'handleUnknownCommand',
        onSilence: 'handleSilence',
    },
    handleStart: {
        message: 'Jasne, przechodzę dalej.',
        action: () => {
            if (username) {
                handleRouteChange(Screens.User);
            } else {
                handleRouteChange(Screens.Login);
            }
        },
    },
    handleUnknownCommand: {
        message: 'Nieznana komenda. Dostępna opcja to: "rozpocznij".',
        repeat: 'promptStart',
    },
    handleSilence: {
        message: 'Nie usłyszałem Cię, proszę powtórz.',
        repeat: 'promptStart',
    },
});