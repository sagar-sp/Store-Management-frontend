import React, { useState, useEffect } from 'react';
import { X, Search, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const CreateOrderModal = ({ onClose, onSuccess }) => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
  }, [search]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products', { params: { search, limit: 10 } });
      setProducts(response.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock_quantity) {
        toast.error('Not enough stock');
        return;
      }
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      if (product.stock_quantity <= 0) {
        toast.error('Out of stock');
        return;
      }
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return item;
        if (newQty > item.stock_quantity) {
          toast.error('Limit reached');
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = 0; // Could add discount logic
  const total = subtotal - discount;

  const handleCheckout = async () => {
    if (cart.length === 0) return toast.error('Cart is empty');
    setLoading(true);
    try {
      await api.post('/orders', {
        customer_id: selectedCustomerId,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal: item.price * item.quantity
        })),
        total_amount: subtotal,
        discount_amount: discount,
        final_amount: total,
        payment_method: paymentMethod
      });
      toast.success('Order placed successfully');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b dark:border-slate-800">
          <div className="flex items-center space-x-2 text-primary-600">
            <ShoppingCart size={24} />
            <h2 className="text-xl font-bold dark:text-white line-clamp-1">New Sale (POS)</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Product Selection */}
          <div className="flex-1 p-6 border-r dark:border-slate-800 flex flex-col overflow-hidden">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search products by name..." 
                className="input-field pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-max">
              {products.map(product => (
                <div 
                  key={product.id} 
                  onClick={() => addToCart(product)}
                  className="card p-4 cursor-pointer hover:border-primary-500 transition-all group relative overflow-hidden"
                >
                  <div className="flex space-x-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                       <Package size={24} className="text-slate-400" />
                    </div>
                    <div>
                      <h4 className="font-bold dark:text-white line-clamp-1">{product.name}</h4>
                      <p className="text-sm text-slate-500">{product.category_name}</p>
                      <div className="flex items-center justify-between mt-1">
                         <span className="text-primary-600 font-bold">${product.price}</span>
                         <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{product.stock_quantity} left</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart & Checkout */}
          <div className="w-full lg:w-96 bg-slate-50 dark:bg-slate-900/50 flex flex-col overflow-hidden">
            <div className="p-6 border-b dark:border-slate-800">
              <h3 className="font-bold dark:text-white mb-4">Customer Details</h3>
              <select 
                className="input-field mb-2"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
              >
                <option value="">Walk-in Customer</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map(item => (
                <div key={item.id} className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-sm dark:text-white line-clamp-1">{item.name}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 p-1 rounded">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 dark:text-white"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 dark:text-white"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="font-bold text-sm text-primary-600">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 opacity-60">
                  <ShoppingCart size={48} />
                  <p className="text-sm font-medium">Cart is empty</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border-t dark:border-slate-800 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="dark:text-white font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span className="dark:text-white">Total Amount</span>
                  <span className="text-primary-600">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Cash', 'Online'].map(method => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                        paymentMethod === method 
                          ? 'border-primary-600 bg-primary-50 text-primary-600 dark:bg-primary-900/10' 
                          : 'border-slate-200 dark:border-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                disabled={loading || cart.length === 0}
                onClick={handleCheckout}
                className="w-full btn-primary py-4 rounded-xl flex items-center justify-center space-x-2 shadow-xl shadow-primary-600/20 active:scale-[0.98]"
              >
                {loading ? 'Processing...' : (
                  <>
                    <span>Checkout</span>
                    <ShoppingCart size={20} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderModal;
