import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  ClipboardList, 
  AlertTriangle, 
  History, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft,
  Search,
  ArrowDownRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const Inventory = () => {
  const [logs, setLogs] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('logs');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'logs') {
        const response = await api.get('/inventory/logs');
        setLogs(response.data);
      } else {
        const response = await api.get('/inventory/low-stock');
        setLowStock(response.data);
      }
    } catch (error) {
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Inventory Control</h1>
          <p className="text-slate-500 dark:text-slate-400">Monitor stock levels and track movement history.</p>
        </div>
      </div>

      <div className="flex space-x-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('logs')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'logs' ? 'bg-white dark:bg-slate-800 shadow-sm dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <History size={16} />
          <span>Movement Logs</span>
        </button>
        <button 
          onClick={() => setActiveTab('low-stock')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'low-stock' ? 'bg-white dark:bg-slate-800 shadow-sm dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <AlertTriangle size={16} />
          <span>Low Stock Alerts</span>
        </button>
      </div>

      {activeTab === 'logs' ? (
        <div className="card overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b dark:border-slate-700 text-xs font-bold text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Change</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">User</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-10">Loading...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-10 text-slate-500">No logs found</td></tr>
              ) : logs.map(log => (
                <tr key={log.id} className="text-sm dark:text-slate-300">
                  <td className="px-6 py-4">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="px-6 py-4 font-semibold">{log.product_name}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center font-bold ${log.change_amount > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {log.change_amount > 0 ? <Plus size={14} className="mr-1" /> : ''}
                      {log.change_amount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] uppercase font-bold tracking-wider">
                      {log.reason}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium">{log.user_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-10 text-slate-500">Loading...</div>
          ) : lowStock.length === 0 ? (
            <div className="col-span-full text-center py-10 text-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">All products are well stocked!</div>
          ) : lowStock.map(product => (
            <div key={product.id} className="card p-6 border-l-4 border-rose-500">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold dark:text-white">{product.name}</h3>
                <AlertTriangle size={20} className="text-rose-500" />
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-slate-500">Current Stock</p>
                  <p className="text-2xl font-bold text-rose-500">{product.stock_quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 mb-1">Threshold: {product.low_stock_threshold}</p>
                  <button 
                    onClick={() => {}} // Could add restock modal call
                    className="text-xs font-bold text-primary-600 hover:underline"
                  >
                    RESTOCK NOW
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Inventory;
