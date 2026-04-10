import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Layers, Plus, Edit2, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData);
        toast.success('Category updated');
      } else {
        await api.post('/categories', formData);
        toast.success('Category created');
      }
      setIsModalOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
      fetchCategories();
    } catch (error) {
      toast.error('Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This might affect products in this category.')) {
      try {
        await api.delete(`/categories/${id}`);
        toast.success('Category deleted');
        fetchCategories();
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Categories</h1>
          <p className="text-slate-500 dark:text-slate-400">Organize your products into logical groups.</p>
        </div>
        <button 
          onClick={() => { setEditingCategory(null); setFormData({name:'', description:''}); setIsModalOpen(true); }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-10 text-slate-500">Loading...</div>
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center py-10 text-slate-500">No categories found</div>
        ) : categories.map(category => (
          <div key={category.id} className="card p-6 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-600 mb-4">
                <Layers size={24} />
              </div>
              <h3 className="text-lg font-bold dark:text-white">{category.name}</h3>
              <p className="text-sm text-slate-500 mt-2 line-clamp-2">{category.description || 'No description provided'}</p>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button 
                onClick={() => { setEditingCategory(category); setFormData({name: category.name, description: category.description}); setIsModalOpen(true); }}
                className="p-2 text-slate-400 hover:text-primary-600 transition-colors"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => handleDelete(category.id)}
                className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl p-6">
            <h2 className="text-xl font-bold dark:text-white mb-6">{editingCategory ? 'Edit Category' : 'New Category'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold dark:text-slate-300">Category Name</label>
                <input 
                  required
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold dark:text-slate-300">Description</label>
                <textarea 
                  className="input-field resize-none"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg dark:text-white">Cancel</button>
                <button type="submit" className="btn-primary">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
