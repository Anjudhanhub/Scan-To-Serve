
import { createClient } from '@supabase/supabase-js';
import type { Order, OrderStatus } from '../types';

const supabaseUrl = 'https://hkcquqltwipxztntjojy.supabase.co';
const supabaseKey = 'sb_publishable_noWKaJ3jV6iZjo9Ar1lHBA__Aet3R-x';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Save a new order to Supabase
export const saveOrder = async (order: Order) => {
  if (!order.userDetails) throw new Error("User details missing");

  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        id: order.id,
        first_name: order.userDetails.firstName,
        last_name: order.userDetails.lastName,
        email: order.userDetails.email,
        mobile: order.userDetails.mobile,
        items: order.items,
        total_amount: order.total,
        status: order.status,
        payment_method: order.paymentMethod
      },
    ]);

  if (error) {
    console.error('Error saving order to Supabase:', error);
    throw error;
  }
  return data;
};

// Fetch all orders
export const getOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders from Supabase:', error);
    return [];
  }
  
  // Map snake_case DB columns to camelCase Typescript interface
  return data.map((item: any) => ({
      id: item.id,
      date: item.created_at,
      items: item.items,
      total: item.total_amount,
      status: item.status as OrderStatus,
      userDetails: {
          firstName: item.first_name,
          lastName: item.last_name,
          email: item.email,
          mobile: item.mobile
      },
      paymentMethod: item.payment_method
  }));
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
        
    if (error) {
        console.error("Error updating status in Supabase:", error);
        throw error;
    }
};

// Delete an order
export const deleteOrder = async (orderId: string) => {
    const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

    if (error) {
        console.error("Error deleting order from Supabase:", error);
        throw error;
    }
};
