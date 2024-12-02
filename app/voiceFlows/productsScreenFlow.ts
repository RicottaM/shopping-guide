import { Screens } from '../enum/screens';
import { Product } from '../models/product.model';
import { Unit } from '../models/unit.model';
import wordsToNumbers from 'words-to-numbers';
import { numberWords } from '../utils/numberWords';

type ScreenFlow = Record<
  string,
  {
    message: string | ((context: any) => string);
    next?: string;
    options?: { command: string; next: string }[];
    onResponse?: string;
    onResponseKey?: string;
    action?: () => void;
    onFailure?: string;
    onSilence?: string;
    repeat?: string;
  }
>;

export const productsScreenFlow = (products: Product[], units: Unit[], handleRouteChange: any, addToCartCommand: any): ScreenFlow => {
  return {
    intro: {
      message: 'You are on the Products screen.',
      next: 'listProducts',
    },
    listProducts: {
      message: `Say the name of a product and give its quantity to add it to the Cart. Call 'Stores', 'Cart' or 'User' to visit other pages. You can check the products list by saying 'products'.`,
      options: [
        ...products.map((product) => ({
          command: product.name.toLowerCase(),
          next: `promptQuantity-${product.name}`,
        })),
        { command: 'products', next: 'getProducts' },
        { command: 'categories', next: 'handleCategories' },
        { command: 'cart', next: 'handleCart' },
        { command: 'user', next: 'handleUser' },
      ],
      onFailure: 'handleUnknownCommand',
      onSilence: 'handleSilence',
    },
    getProducts: {
      message: () => {
        const productsString = products.map((product) => product.name).join(', ');
        return `Available products are: ${productsString}`;
      },
      repeat: 'listProducts',
    },
    ...products.reduce((acc: ScreenFlow, product) => {
      const productUnit = units.find((unit) => unit.unit_id === product.unit_id)?.unit_name;

      acc[`promptQuantity-${product.name}`] = {
        message: `Please provide the quantity of ${product.name} in ${productUnit}s or say 'no' to cancel.`,
        onResponse: `confirmQuantity-${product.name}`,
        onResponseKey: `${product.name}-quantity`,
        onFailure: 'handleUnknownCommand',
        onSilence: 'handleSilence',
      };

      acc[`confirmQuantity-${product.name}`] = {
        message: (context: any) => {
          console.log('context: ', context);
          let quantity = context[`${product.name}-quantity`];
          quantity = quantity.trim().toLowerCase();

          if (numberWords[quantity]) {
            quantity = numberWords[quantity];
          } else {
            quantity = quantity.replace(/[^0-9]/g, '');
            quantity = parseInt(quantity, 10);
          }

          console.log('parsed quantity: ', quantity);

          if (isNaN(quantity) || quantity <= 0) {
            return `Invalid value. Please try again.`;
          }

          if (quantity > product.amount) {
            return `There is only ${Number(product.amount)} product left. Please try again.`;
          }

          // Zapisujemy quantity do context
          context[`${product.name}-quantity-final`] = quantity;

          return `I understood: ${quantity} ${product.name}(s). Is that correct? Say "yes" or "no".`;
        },
        options: [
          {
            command: 'yes',
            next: `addToCart-${product.name}`,
          },
          {
            command: 'no',
            next: `promptQuantity-${product.name}`,
          },
        ],
        onFailure: 'handleUnknownCommand',
        onSilence: 'handleSilence',
      };

      acc[`addToCart-${product.name}`] = {
        message: (context: any) => {
          const quantity = context[`${product.name}-quantity-final`];

          console.log('quantity: ', quantity);

          if (!quantity) {
            return `Error: Could not add ${product.name} to the cart. Quantity is missing.`;
          }

          try {
            addToCartCommand(product, quantity);
            return `Added ${quantity} ${product.name}(s) to the cart. Returning to the product list.`;
          } catch (error) {
            console.error(error);
            return `Failed to add ${product.name} to the cart. Please try again.`;
          }
        },
        next: 'listProducts',
      };

      return acc;
    }, {} as ScreenFlow),

    handleCategories: {
      message: `Moving to Categories`,
      action: () => handleRouteChange(Screens.Categories),
    },
    handleCart: {
      message: `Moving to Cart`,
      action: () => handleRouteChange(Screens.Cart),
    },
    handleUser: {
      message: `Moving to User`,
      action: () => handleRouteChange(Screens.User),
    },
    handleUnknownCommand: {
      message: 'I did not understand your command.',
      repeat: 'listProducts',
    },
    handleSilence: {
      message: 'I did not hear your response.',
      repeat: 'listProducts',
    },
  };
};
