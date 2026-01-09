
export interface CustomizationOption {
  name: string;
  priceChange?: number;
}

export interface Customization {
  name: string;
  type: 'radio' | 'checkbox';
  options: CustomizationOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  rating: number;
  customizations?: Customization[];
}

export interface CartItem extends MenuItem {
  cartItemId: string; // A unique ID for this specific cart item instance (item + customizations)
  quantity: number;
  selectedCustomizations?: { [key: string]: string | string[] };
}

export interface Restaurant {
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  menu: MenuItem[];
}

export type View = 'home' | 'menu' | 'orders' | 'settings' | 'map';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type OrderStatus = 'Order Placed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export type PaymentMethod = 'upi' | 'card' | 'cod';

export interface UserDetails {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
}

export interface Order {
  id:string;
  date: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  userDetails?: UserDetails;
  paymentMethod?: PaymentMethod;
}
