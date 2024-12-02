import { Screens } from '../enum/screens';
import { Category } from '../models/category.model';

export const categoriesScreenFlow = (categories: Category[], handleRouteChange: any, router: any) => {
  const dynamicCategoryHandlers: Record<string, { message: string; action: () => void }> = categories.reduce(
    (acc, category) => {
      acc[`handle-${category.category_name}`] = {
        message: `Moving to ${category.category_name}`,
        action: () => router.push(`/screens/products?categoryId=${category.category_id}`),
      };
      return acc;
    },
    {} as Record<string, { message: string; action: () => void }>
  );

  return {
    intro: {
      message: 'You are on the Categories screen.',
      next: 'listCategories',
    },
    listCategories: {
      message: `Say the name of a category to view its products or say 'Stores', 'Cart' or 'User' to visit other pages. Say 'categories' to get the categories list.`,
      options: [
        ...categories.map((category: Category) => ({
          command: category.category_name.toLowerCase(),
          next: `handle-${category.category_name}`,
        })),
        {
          command: 'categories',
          next: 'getCategories',
        },
        {
          command: 'stores',
          next: 'handleStores',
        },
        {
          command: 'cart',
          next: 'handleCart',
        },
        {
          command: 'user',
          next: 'handleUser',
        },
      ],
      onFailure: 'handleUnknownCommand',
      onSilence: 'handleSilence',
    },
    getCategories: {
      message: () => {
        const categoriesString = categories.map((category) => category.category_name).join(', ');
        const messageString = `Available categories are: ${categoriesString}`;
        return messageString;
      },
      repeat: 'listCategories',
    },
    handleUnknownCommand: {
      message: 'I did not understand your command.',
      repeat: 'listCategories',
    },
    handleSilence: {
      message: 'I did not hear your response.',
      repeat: 'listCategories',
    },
    handleStores: {
      message: `Moving to Stores`,
      action: () => handleRouteChange(Screens.Map),
    },
    handleCart: {
      message: `Moving to Cart`,
      action: () => handleRouteChange(Screens.Cart),
    },
    handleUser: {
      message: `Moving to User`,
      action: () => handleRouteChange(Screens.User),
    },
    ...dynamicCategoryHandlers,
  };
};
