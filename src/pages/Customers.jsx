import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Users, Plus, Search, Mail, Phone, MapPin, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer.id}`, formData);
        toast.success('Customer updated');
      } else {
        await api.post('/customers', formData);
        toast.success('Customer added');
      }
      setIsModalOpen(false);
      setEditingCustomer(null);
      setFormData({ name: '', email: '', phone: '', address: '' });
      fetchCustomers();
    } catch (error) {
      toast.error('Failed to save customer');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Customer Database</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage customer profiles and contact details.</p>
        </div>
        <button 
          onClick={() => { setEditingCustomer(null); setFormData({name:'', email:'', phone:'', address:''}); setIsModalOpen(true); }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Customer</span>
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-slate-700">
            {loading ? (
              <tr><td colSpan="4" className="text-center py-10">Loading...</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-10 text-slate-500">No customers found</td></tr>
            ) : customers.map(customer => (
              <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center font-bold mr-3 text-sm">
                      {customer.name.charAt(0)}
                    </div>
                    <span className="font-semibold dark:text-white">{customer.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center text-xs text-slate-500">
                      <Mail size={12} className="mr-1" /> {customer.email || 'N/A'}
                    </div>
                    <div className="flex items-center text-xs text-slate-500">
                      <Phone size={12} className="mr-1" /> {customer.phone || 'N/A'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-xs text-slate-500 truncate max-w-[200px]">
                    <MapPin size={12} className="mr-1 flex-shrink-0" /> {customer.address || 'No address'}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                   <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => { setEditingCustomer(customer); setFormData({name: customer.name, email: customer.email, phone: customer.phone, address: customer.address}); setIsModalOpen(true); }}
                        className="p-2 text-slate-400 hover:text-primary-600"
                      >
                        <Edit2 size={18} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <h2 className="text-xl font-bold dark:text-white mb-6 font-primary">{editingCustomer ? 'Edit Customer' : 'Add Customer'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold dark:text-slate-300">Full Name</label>
                <input 
                  required
                  className="input-field"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold dark:text-slate-300">Email</label>
                  <input 
                    type="email"
                    className="input-field"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold dark:text-slate-300">Phone</label>
                  <input 
                    className="input-field"
                    placeholder="+91..."
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold dark:text-slate-300">Address</label>
                <textarea 
                  className="input-field resize-none"
                  rows="3"
                  placeholder="Street, City..."
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4 font-primary">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg dark:text-white">Cancel</button>
                <button type="submit" className="btn-primary">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
