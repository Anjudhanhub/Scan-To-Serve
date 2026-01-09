
import React, { useState, useEffect, useMemo } from 'react';
import type { Order, OrderStatus, CartItem } from '../types';
import { ReceiptIcon, TrashIcon, ArrowLeftIcon, InformationCircleIcon, CloseIcon } from './Icons';
import { getOrders, updateOrderStatus, deleteOrder } from '../services/supabaseClient';

interface OrdersScreenProps {
    onBack: () => void;
}

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const statusStyles: { [key in OrderStatus]: string } = {
        'Order Placed': 'bg-blue-100 text-blue-800',
        'Preparing': 'bg-yellow-100 text-yellow-800',
        'Out for Delivery': 'bg-green-100 text-green-800',
        'Delivered': 'bg-gray-100 text-gray-800',
        'Cancelled': 'bg-red-100 text-red-800',
    };

    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};


const OrdersScreen: React.FC<OrdersScreenProps> = ({ onBack }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingItem, setViewingItem] = useState<CartItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAndUpdateOrders = async () => {
        try {
            const fetchedOrders = await getOrders();
            let savedOrders = fetchedOrders;
            
            // Simulation Logic: Update status based on time elapsed since order creation
            // Note: In a real backend, this would happen on the server.
            // We simulate it here and update Supabase if needed.
            const now = Date.now();
            let hasUpdates = false;

            const updatedOrders = await Promise.all(savedOrders.map(async (order) => {
                // Skip simulation if cancelled or delivered
                if (order.status === 'Cancelled' || order.status === 'Delivered') {
                     return order; 
                }

                const orderTime = new Date(order.date).getTime();
                const elapsedSeconds = (now - orderTime) / 1000;
                
                let newStatus: OrderStatus = order.status;

                // Simulation Timeline:
                // 0-15s: Order Placed
                // 15-30s: Preparing
                // 30-45s: Out for Delivery
                // 45s+: Delivered
                
                if (elapsedSeconds > 45) {
                     newStatus = 'Delivered';
                } else if (elapsedSeconds > 30 && elapsedSeconds <= 45 && order.status !== 'Out for Delivery') {
                     newStatus = 'Out for Delivery';
                } else if (elapsedSeconds > 15 && elapsedSeconds <= 30 && order.status !== 'Preparing' && order.status !== 'Out for Delivery') {
                     newStatus = 'Preparing';
                }

                if (newStatus !== order.status) {
                    hasUpdates = true;
                    // Attempt to update status in DB
                    try {
                        await updateOrderStatus(order.id, newStatus);
                        return { ...order, status: newStatus };
                    } catch (e) {
                        console.error("Failed to update status for order", order.id);
                        return order;
                    }
                }
                return order;
            }));

            setOrders(updatedOrders);
        } catch (error) {
            console.error("Failed to load/update orders", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    loadAndUpdateOrders();

    // Set up interval to check for status updates every 5 seconds
    const intervalId = setInterval(loadAndUpdateOrders, 5000);

    return () => clearInterval(intervalId);
  }, []);
  
  const filteredOrders = useMemo(() => {
    if (!searchQuery) {
        return orders;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return orders.filter(order => {
        const orderIdMatch = order.id.slice(-5).toLowerCase().includes(lowercasedQuery);
        const itemNameMatch = order.items.some(item =>
            item.name.toLowerCase().includes(lowercasedQuery)
        );
        return orderIdMatch || itemNameMatch;
    });
  }, [orders, searchQuery]);


  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order from your history?')) {
        try {
            await deleteOrder(orderId);
            setOrders(prev => prev.filter(o => o.id !== orderId));
        } catch (error) {
            console.error("Failed to delete order", error);
            alert("There was an error deleting the order.");
        }
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
        try {
            await updateOrderStatus(orderId, 'Cancelled');
            setOrders(prev => prev.map(o => 
                o.id === orderId ? { ...o, status: 'Cancelled' as OrderStatus } : o
            ));
        } catch (error) {
            console.error("Failed to cancel order", error);
            alert("There was an error cancelling the order.");
        }
    }
  };

  return (
    <div className="p-4">
      <header className="mb-6 relative max-w-3xl mx-auto flex items-center justify-center">
        <button 
            onClick={onBack}
            className="absolute left-0 p-2 text-textSecondary hover:text-primary transition-colors rounded-full hover:bg-gray-100"
            aria-label="Go back to settings"
        >
            <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div className="text-center">
            <h1 className="font-display text-4xl md:text-5xl text-primary">Your Past Orders</h1>
            <p className="text-textSecondary mt-2">A history of your delicious meals.</p>
        </div>
      </header>
      
      {orders.length > 0 && (
          <div className="max-w-3xl mx-auto mb-6 relative">
            <input
                type="text"
                placeholder="Search by Order ID or item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-textSecondary">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-textSecondary">
            <ReceiptIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg">You haven't placed any orders yet.</p>
            <p>Your past orders will appear here.</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 text-textSecondary">
            <p className="text-lg font-semibold">No orders found for "{searchQuery}"</p>
            <p>Try a different search term.</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl mx-auto">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start border-b pb-2 mb-2">
                <div>
                    <p className="font-bold text-lg text-primary">Order #{order.id.slice(-5)}</p>
                    <p className="text-sm text-textSecondary">
                        {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                    </p>
                    {order.userDetails && (
                        <p className="text-xs text-textSecondary mt-1">
                            Ordered by: <span className="font-medium text-gray-700">{order.userDetails.firstName} {order.userDetails.lastName}</span>
                        </p>
                    )}
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                    <div className="flex items-center gap-3">
                        <p className="text-xl font-bold text-textPrimary">Rs.{order.total.toFixed(2)}</p>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteOrder(order.id);
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                            title="Delete Order"
                            aria-label="Delete this order"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                    <StatusBadge status={order.status || 'Delivered'} />
                    
                    {/* Cancel Button */}
                    {(order.status === 'Order Placed' || order.status === 'Preparing') && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCancelOrder(order.id);
                            }}
                            className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full transition-colors border border-red-100 mt-1"
                        >
                            Cancel Order
                        </button>
                    )}

                    {order.paymentMethod && (
                        <span className="text-xs text-gray-500 font-medium">
                            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                             order.paymentMethod === 'upi' ? 'Paid via UPI' : 'Paid via Card'}
                        </span>
                    )}
                </div>
              </div>
              <div>
                <ul className="space-y-3 mt-3">
                  {order.items.map(item => (
                    <li key={item.cartItemId} className="flex items-start justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex-grow">
                          <div className="flex justify-between text-sm font-medium text-textPrimary">
                            <span>{item.name} <span className="text-gray-500 font-normal">x {item.quantity}</span></span>
                            <span>Rs.{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                          {item.selectedCustomizations && (
                            <div className="text-xs text-gray-500 mt-1">
                              {Object.entries(item.selectedCustomizations).map(([key, value]) => (
                                <span key={key} className="block">
                                  {key}: {Array.isArray(value) ? value.join(', ') : value}
                                </span>
                              ))}
                            </div>
                          )}
                      </div>
                      <button 
                        onClick={(e) => {
                             e.stopPropagation();
                             setViewingItem(item);
                        }}
                        className="ml-3 p-1 text-primary hover:bg-orange-100 rounded transition-colors"
                        title="View Details"
                      >
                         <InformationCircleIcon className="w-5 h-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Details Modal */}
      {viewingItem && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-fade-in" onClick={() => setViewingItem(null)}>
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="relative h-48 shrink-0">
                    <img src={viewingItem.imageUrl} alt={viewingItem.name} className="w-full h-full object-cover" />
                    <button 
                        onClick={() => setViewingItem(null)}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors backdrop-blur-sm"
                    >
                        <CloseIcon className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-xl font-bold text-white">{viewingItem.name}</h3>
                    </div>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    <p className="text-gray-600 mb-6 leading-relaxed text-sm">{viewingItem.description}</p>
                    
                    <div className="space-y-4">
                         <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-100">
                             <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Price per item</span>
                                <span className="font-medium">Rs.{viewingItem.price.toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Quantity</span>
                                <span className="font-medium">{viewingItem.quantity}</span>
                             </div>
                             <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-primary">
                                <span>Total Price</span>
                                <span>Rs.{(viewingItem.price * viewingItem.quantity).toFixed(2)}</span>
                             </div>
                         </div>

                         {viewingItem.selectedCustomizations && Object.keys(viewingItem.selectedCustomizations).length > 0 && (
                            <div>
                                <h4 className="font-bold text-textPrimary text-sm mb-3 uppercase tracking-wide">Customizations</h4>
                                <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                                    <ul className="space-y-2 text-sm">
                                        {Object.entries(viewingItem.selectedCustomizations).map(([key, value]) => (
                                            <li key={key} className="flex justify-between items-start">
                                                <span className="text-gray-600 font-medium">{key}</span>
                                                <span className="text-textPrimary text-right max-w-[50%]">{Array.isArray(value) ? value.join(', ') : value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default OrdersScreen;
