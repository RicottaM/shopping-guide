import { Screens } from '../enum/screens';

export const codeScreenFlow = (handleRouteChange: any) => {
  return {
    intro: {
      message: 'You are on the Code screen.',
      next: 'listCode',
    },
    listCode: {
      message: `Say 'back', to go back to the cart.`,
      options: [
        {
          command: 'back',
          next: 'handleBack',
        },
      ],
      onFailure: 'handleUnknownCommand',
      onSilence: 'handleSilence',
    },
    handleUnknownCommand: {
      message: 'I did not understand your command.',
      repeat: 'listCode',
    },
    handleSilence: {
      message: 'I did not hear your response.',
      repeat: 'listCode',
    },
    handleBack: {
      message: 'Moving to Cart.',
      action: () => handleRouteChange(Screens.Cart),
    },
  };
};
