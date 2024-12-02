import { Screens } from '../enum/screens';
import { Store } from '../models/store.model';

export const userScreenFlow = (handleRouteChange: any, handleLogout: any) => ({
  intro: {
    message: 'You are on the User screen.',
    next: 'promptStart',
  },
  promptStart: {
    message: `Say 'Log out' to log out of your account. Say 'Categories', 'Cart' or 'Stores', to visit other pages.`,
    options: [
      {
        command: 'log out',
        next: 'handleLogout',
      },
      {
        command: 'categories',
        next: 'handleCategories',
      },
      {
        command: 'cart',
        next: 'handleCart',
      },
      {
        command: 'stores',
        next: 'handleStores',
      },
    ],
    onFailure: 'handleUnknownCommand',
    onSilence: 'handleSilence',
  },
  handleLogout: {
    message: 'You have been logged out.',
    action: async () => await handleLogout(),
  },
  handleCategories: {
    message: 'Moving to categories.',
    action: () => handleRouteChange(Screens.Categories),
  },
  handleCart: {
    message: 'Moving to cart.',
    action: () => handleRouteChange(Screens.Cart),
  },
  handleStores: {
    message: 'Moving to stores.',
    action: () => handleRouteChange(Screens.Map),
  },
  handleUnknownCommand: {
    message: 'Unknown command.',
    repeat: 'promptStart',
  },
  handleSilence: {
    message: 'I did not hear you. Please repeat.',
    repeat: 'promptStart',
  },
});
