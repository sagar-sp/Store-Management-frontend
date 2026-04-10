import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Package, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import ProductForm from '../components/ProductForm';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [page, search, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products', {
        params: { search, category_id: selectedCategory, page, limit: 10 }
      });
      setProducts(response.data.products);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Product deleted');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Product Catalog</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your inventory and product listings.</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="btn-primary flex items-center justify-center space-x-2 shadow-lg shadow-primary-600/20"
        >
          <Plus size={20} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="input-field pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="input-field min-w-[150px]"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button className="p-2 border dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
            <Filter size={20} className="text-slate-500" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-700">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-10">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-10 text-slate-500">No products found</td></tr>
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-3">
                        {product.image_url ? (
                          <img src={product.image_url} alt="" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Package size={20} className="text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold dark:text-white capitalize">{product.name}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[200px]">{product.description || 'No description'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-md">
                      {product.category_name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold dark:text-white">${Number(product.price).toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                      product.stock_quantity <= product.low_stock_threshold 
                        ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/20' 
                        : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20'
                    }`}>
                      {product.stock_quantity} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="p-2 text-slate-400 hover:text-primary-600 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t dark:border-slate-700 flex items-center justify-between">
          <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
          <div className="flex space-x-2">
            <button 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-2 border dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 border dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ProductForm 
          product={editingProduct} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); fetchProducts(); }}
          categories={categories}
        />
      )}
    </div>
  );
};

export default Products;
