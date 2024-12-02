import { Screens } from '../enum/screens';
import { Product } from '../models/product.model';

export const cartScreenFlow = (products: Product[], handleRouteChange: any, removeFromCart: any) => {
  const dynamicProductHandlers: Record<string, { message: string; action: () => void }> = products.reduce(
    (acc, product) => {
      acc[`handle-${product.name}`] = {
        message: `Product ${product.name} has been deleted from cart.`,
        action: async () => {
          await removeFromCart(product);
        },
      };
      return acc;
    },
    {} as Record<string, { message: string; action: () => void }>
  );

  return {
    intro: {
      message: 'You are on the Cart screen.',
      next: 'listStores',
    },
    listStores: {
      message: `Say 'products', to get full content of your cart. Say the name of a product to delete it. You can visit other pages by saying 'Categories', 'Code', 'Navigation' or 'User'.`,
      options: [
        ...products.map((product: Product) => ({
          command: product.name.toLowerCase(),
          next: `handle-${product.name}`,
        })),
        {
          command: 'products',
          next: 'getProducts',
        },
        {
          command: 'categories',
          next: 'handleCategories',
        },
        {
          command: 'code',
          next: 'handleCode',
        },
        {
          command: 'navigation',
          next: 'handleNavigation',
        },
        {
          command: 'user',
          next: 'handleUser',
        },
      ],
      onFailure: 'handleUnknownCommand',
      onSilence: 'handleSilence',
    },
    getProducts: {
      message: () => {
        const storesString = products.map((product: Product) => product.name).join(', ');
        const messageString = `Products in your cart: ${storesString}`;
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
    handleCategories: {
      message: `Moving to Categories`,
      action: () => handleRouteChange(Screens.Categories),
    },
    handleCode: {
      message: `Moving to Code`,
      action: () => handleRouteChange(Screens.Code),
    },
    handleNavigation: {
      message: `Moving to Navigation`,
      action: () => handleRouteChange(Screens.Navigation),
    },
    handleUser: {
      message: `Moving to User`,
      action: () => handleRouteChange(Screens.User),
    },
    ...dynamicProductHandlers,
  };
};
