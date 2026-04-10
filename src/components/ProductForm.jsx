import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const ProductForm = ({ product, onClose, onSuccess, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    cost_price: '',
    stock_quantity: '',
    low_stock_threshold: '10',
    description: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category_id: product.category_id || '',
        price: product.price || '',
        cost_price: product.cost_price || '',
        stock_quantity: product.stock_quantity || '',
        low_stock_threshold: product.low_stock_threshold || '10',
        description: product.description || '',
        image_url: product.image_url || ''
      });
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (product) {
        await api.put(`/products/${product.id}`, formData);
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', formData);
        toast.success('Product created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <h2 className="text-xl font-bold dark:text-white">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold dark:text-slate-300">Product Name *</label>
              <input 
                required
                className="input-field"
                placeholder="e.g. iPhone 15 Pro"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold dark:text-slate-300">Category</label>
              <select 
                className="input-field"
                value={formData.category_id}
                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold dark:text-slate-300">Selling Price ($) *</label>
              <input 
                required
                type="number"
                step="0.01"
                className="input-field"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold dark:text-slate-300">Cost Price ($)</label>
              <input 
                type="number"
                step="0.01"
                className="input-field"
                placeholder="0.00"
                value={formData.cost_price}
                onChange={(e) => setFormData({...formData, cost_price: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold dark:text-slate-300">Stock Quantity *</label>
              <input 
                required
                type="number"
                className="input-field"
                placeholder="0"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({...formData, stock_quantity: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold dark:text-slate-300">Low Stock Alert at</label>
              <input 
                type="number"
                className="input-field"
                placeholder="10"
                value={formData.low_stock_threshold}
                onChange={(e) => setFormData({...formData, low_stock_threshold: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-slate-300">Image URL</label>
            <input 
              className="input-field"
              placeholder="https://example.com/image.jpg"
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-slate-300">Description</label>
            <textarea 
              rows="3"
              className="input-field resize-none"
              placeholder="Add product details..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t dark:border-slate-800">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2 rounded-lg border dark:border-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button 
              disabled={loading}
              type="submit" 
              className="btn-primary min-w-[120px]"
            >
              {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
