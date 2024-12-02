import { Screens } from '../enum/screens';
import { Store } from '../models/store.model';

export const mapScreenFlow = (stores: Store[], handleRouteChange: any, selectStoreCommand: any) => {
  const dynamicStoreHandlers: Record<string, { message: string; action: () => void }> = stores.reduce(
    (acc, store) => {
      acc[`handle-${store.store_name}`] = {
        message: `Store ${store.store_name} has been successfuly selected.`,
        action: async () => {
          await selectStoreCommand(store.store_id);
          handleRouteChange(Screens.Categories);
        },
      };
      return acc;
    },
    {} as Record<string, { message: string; action: () => void }>
  );

  return {
    intro: {
      message: 'You are on the Stores screen.',
      next: 'listStores',
    },
    listStores: {
      message: `Say the name of a store to select it or 'back', to go back to categories. Say 'stores' to get the full list of stores.`,
      options: [
        ...stores.map((store: Store) => ({
          command: store.store_name.toLowerCase(),
          next: `handle-${store.store_name}`,
        })),
        {
          command: 'stores',
          next: 'getStores',
        },
        {
          command: 'back',
          next: 'handleBack',
        },
      ],
      onFailure: 'handleUnknownCommand',
      onSilence: 'handleSilence',
    },
    getStores: {
      message: () => {
        const storesString = stores.map((store: Store) => store.store_name).join(', ');
        const messageString = `Available stores are: ${storesString}`;
        return messageString;
      },
      repeat: 'listStores',
    },
    handleUnknownCommand: {
      message: 'I did not understand your command.',
      repeat: 'listStores',
    },
    handleSilence: {
      message: 'I did not hear your response.',
      repeat: 'listStores',
    },
    handleBack: {
      message: `Moving to Categories`,
      action: () => handleRouteChange(Screens.Categories),
    },
    ...dynamicStoreHandlers,
  };
};
