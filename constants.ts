
import type { Restaurant } from './types';

export const RESTAURANT_DATA: Restaurant = {
  name: "Scan To Serve",
  address: "123 Anna Nagar, Chennai",
  location: {
    lat: 13.0827,
    lng: 80.2707
  },
  menu: [
    // Main Dish
    {
      id: '1',
      name: 'Meals',
      description: 'A traditional South Indian thali with a variety of flavorful dishes served on a banana leaf.',
      price: 50,
      imageUrl: `https://tse4.mm.bing.net/th/id/OIP.IRJcf5i5TN2eCVyfiKBf7QHaEK?pid=Api&P=0&h=180`,
      category: 'Main Dish',
      rating: 5
    },
    {
      id: '2',
      name: 'Biryani',
      description: 'Aromatic rice dish cooked with spices and marinated chicken, a true delight.',
      price: 60,
      imageUrl: `https://tse4.mm.bing.net/th/id/OIP.hYAWojbrro3xW62L1cH6awHaE8?pid=Api&P=0&h=180`,
      category: 'Main Dish',
      rating: 5,
      customizations: [
        {
          name: 'Spice Level',
          type: 'radio',
          options: [
            { name: 'Mild' },
            { name: 'Medium' },
            { name: 'Spicy' },
          ]
        }
      ]
    },
    {
      id: '3',
      name: 'Porotta',
      description: 'Flaky, layered flatbread that is soft on the inside and crispy on the outside, served with curry.',
      price: 15,
      imageUrl: `https://tse1.mm.bing.net/th/id/OIP.defAkLH-UMSaNVAonf8XpwHaD2?pid=Api&P=0&h=180`,
      category: 'Main Dish',
      rating: 4
    },
    {
      id: '4',
      name: 'Veg Biryani',
      description: 'A fragrant and flavorful rice dish made with mixed vegetables and aromatic spices.',
      price: 40,
      imageUrl: `https://tse2.mm.bing.net/th/id/OIP.LadujoU81UAUhQjy9gElUwHaHa?pid=Api&P=0&h=180`,
      category: 'Main Dish',
      rating: 4,
       customizations: [
        {
          name: 'Spice Level',
          type: 'radio',
          options: [
            { name: 'Mild' },
            { name: 'Medium' },
            { name: 'Spicy' },
          ]
        }
      ]
    },
    // Appetizers
    {
      id: '5',
      name: 'Vada',
      description: 'Crispy and savory deep-fried fritter made from lentils, perfect with chutney.',
      price: 10,
      imageUrl: `https://tse3.mm.bing.net/th/id/OIP.6ZNwXqoQ2tMWZuaHCTfKswHaE8?pid=Api&P=0&h=180`,
      category: 'Appetizers',
      rating: 5
    },
    {
      id: '6',
      name: 'Chicken 65',
      description: 'Spicy, deep-fried chicken bites marinated in a blend of Indian spices.',
      price: 30,
      imageUrl: `https://tse3.mm.bing.net/th/id/OIP.oTYhQBYoVRxesB14v2JzagHaHa?pid=Api&P=0&h=180`,
      category: 'Appetizers',
      rating: 4,
      customizations: [
        {
          name: 'Add-ons',
          type: 'checkbox',
          options: [
            { name: 'Extra Curry Leaves' },
            { name: 'Lemon Squeeze' }
          ]
        }
      ]
    },
    {
      id: '7',
      name: 'Gopi 65',
      description: 'A delicious vegetarian appetizer made with cauliflower florets, spices, and herbs.',
      price: 20,
      imageUrl: `https://tse3.mm.bing.net/th/id/OIP.ekVK-zSoYosXu05sxp8dDgHaEK?pid=Api&P=0&h=180`,
      category: 'Appetizers',
      rating: 4
    },
    {
      id: '8',
      name: 'Bonda',
      description: 'A popular South Indian snack of deep-fried potato balls coated in gram flour batter.',
      price: 10,
      imageUrl: `https://tse3.mm.bing.net/th/id/OIP.JDexqd46ffSD5Bna6lPl3wHaEc?pid=Api&P=0&h=180`,
      category: 'Appetizers',
      rating: 4
    },
    // Desserts
     {
      id: '9',
      name: 'Gulab Jamun',
      description: 'Soft, spongy balls made of milk solids, soaked in a fragrant sugar syrup.',
      price: 40,
      imageUrl: `https://tse3.mm.bing.net/th/id/OIP.B32bansRI7RS3yfbUSEBNwHaHa?pid=Api&P=0&h=180`,
      category: 'Desserts',
      rating: 5
    },
    {
      id: '10',
      name: 'Ice Cream',
      description: 'Creamy and delicious ice cream, available in various classic flavors.',
      price: 40,
      imageUrl: `https://tse4.mm.bing.net/th/id/OIP.0rxzPmpKezOzcYg8h5drMgHaEo?pid=Api&P=0&h=180`,
      category: 'Desserts',
      rating: 4
    },
     {
      id: '11',
      name: 'Payasam',
      description: 'A traditional Indian pudding made with milk, sugar, and vermicelli or rice.',
      price: 40,
      imageUrl: `https://tse3.mm.bing.net/th/id/OIP.TotdtyDPRaRqNkIZq4qSlQHaE8?pid=Api&P=0&h=180`,
      category: 'Desserts',
      rating: 4
    },
    {
      id: '12',
      name: 'Cake',
      description: 'A slice of rich and decadent chocolate cake, perfect for satisfying your sweet tooth.',
      price: 30,
      imageUrl: `https://tse1.mm.bing.net/th/id/OIP.7bEK8zNR1hmj63EuvmzdYgHaLH?pid=Api&P=0&h=180`,
      category: 'Desserts',
      rating: 4
    },
     // Beverages
    {
      id: '13',
      name: 'Juice',
      description: 'A refreshing glass of freshly squeezed fruit juice to quench your thirst.',
      price: 20,
      imageUrl: `https://tse3.mm.bing.net/th/id/OIP.jx61Wu1l4Mm3KOwq1sAsBwHaE8?pid=Api&P=0&h=180`,
      category: 'Beverages',
      rating: 5
    },
    {
      id: '14',
      name: 'Coffee',
      description: 'A hot, aromatic cup of coffee, brewed to perfection for a rich taste.',
      price: 20,
      imageUrl: `https://tse2.mm.bing.net/th/id/OIP.pjkzdFGX7t6mmm1BxF1IkQHaE8?pid=Api&P=0&h=180`,
      category: 'Beverages',
      rating: 4
    },
    {
      id: '15',
      name: 'Milk Shake',
      description: 'A thick and creamy milkshake, blended with ice cream and your choice of flavor.',
      price: 40,
      imageUrl: `https://tse2.mm.bing.net/th/id/OIP.9Gs7dhJ1Z20bRZpwx5PApQHaHa?pid=Api&P=0&h=180`,
      category: 'Beverages',
      rating: 4
    },
    {
      id: '16',
      name: 'Soft Drinks',
      description: 'A selection of popular carbonated soft drinks to accompany your meal.',
      price: 40,
      imageUrl: `https://tse2.mm.bing.net/th/id/OIP.m407uzBglOolPPMZ_xyVQAHaE8?pid=Api&P=0&h=180`,
      category: 'Beverages',
      rating: 3
    }
  ]
};