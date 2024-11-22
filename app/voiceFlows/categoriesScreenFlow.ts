import { Screens } from '../enum/screens';
import { Category } from '../models/category.model';

export const categoriesScreenFlow = (categories: Category[], handleRouteChange: any, router: any) => ({
  intro: {
    message: 'You are on the Categories screen. Here are the available options.',
    next: 'listCategories',
  },
  listCategories: {
    message: (context: any) =>
      `Available categories are: ${categories.map((cat) => cat.category_name).join(', ')}. Say the name of a category to view its products, or choose one of the following options: Map, Cart, or User.`,
    options: [
      ...categories.map((category) => ({
        command: category.category_name.toLowerCase(),
        action: () => router.push(`/screens/products?categoryId=${category.category_id}`),
      })),
      {
        command: 'map',
        action: () => handleRouteChange(Screens.Map),
      },
      {
        command: 'cart',
        action: () => handleRouteChange(Screens.Cart),
      },
      {
        command: 'user',
        action: () => handleRouteChange(Screens.User),
      },
    ],
    onFailure: 'handleUnknownCommand',
    onSilence: 'handleSilence',
  },
  handleUnknownCommand: {
    message: 'I did not understand your command. Please say a category name, or choose Map, Cart, or User.',
    repeat: 'listCategories',
  },
  handleSilence: {
    message: 'I did not hear your response. Please say a category name, or choose Map, Cart, or User.',
    repeat: 'listCategories',
  },
});
