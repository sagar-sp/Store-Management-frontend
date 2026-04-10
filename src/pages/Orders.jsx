import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Eye, 
  XCircle,
  Clock,
  CheckCircle,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import CreateOrderModal from '../components/CreateOrderModal';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (id) => {
    if (window.confirm('Are you sure you want to cancel this order? This will restore stock.')) {
      try {
        await api.put(`/orders/${id}/cancel`);
        toast.success('Order cancelled');
        fetchOrders();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to cancel order');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20';
      case 'Cancelled': return 'bg-rose-100 text-rose-600 dark:bg-rose-900/20';
      default: return 'bg-amber-100 text-amber-600 dark:bg-amber-900/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Order Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Process sales and track order history.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center justify-center space-x-2 shadow-lg shadow-primary-600/20"
        >
          <Plus size={20} />
          <span>New Sale (POS)</span>
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Total</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-10">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-10 text-slate-500">No orders found</td></tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="px-6 py-4 font-medium dark:text-white">#{order.id.toString().padStart(5, '0')}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold dark:text-white">{order.customer_name || 'Walk-in Customer'}</div>
                    <div className="text-xs text-slate-500">Processed by {order.processed_by}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-bold dark:text-white">${Number(order.final_amount).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(order.order_status)}`}>
                      {order.order_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2 text-slate-400">
                      <button className="p-2 hover:text-primary-600 transition-colors">
                        <FileText size={18} />
                      </button>
                      {order.order_status === 'Completed' && (
                        <button 
                          onClick={() => handleCancelOrder(order.id)}
                          className="p-2 hover:text-rose-600 transition-colors"
                          title="Cancel Order"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <CreateOrderModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); fetchOrders(); }}
        />
      )}
    </div>
  );
};

export default Orders;
