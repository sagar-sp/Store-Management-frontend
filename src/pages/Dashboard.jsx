import { useEffect, useState } from "react";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import { api } from "../services/api";
import { useAuth } from "../hooks/useAuth";

function Dashboard() {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [message, setMessage] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateOrUpdate = async (payload) => {
    try {
      if (selectedProduct) {
        await api.put(`/products/${selectedProduct.id}`, payload);
        setMessage("Product updated successfully.");
      } else {
        await api.post("/products", payload);
        setMessage("Product created successfully.");
      }
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      setMessage(error.response?.data?.message || "Operation failed.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setMessage("Product deleted successfully.");
      fetchProducts();
    } catch (error) {
      setMessage(error.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <div className="container">
      <header className="card row between">
        <div>
          <h2>Store Management Dashboard</h2>
          <p>Welcome {user?.name}</p>
        </div>
        <button className="secondary" onClick={logout}>
          Logout
        </button>
      </header>

      <p>{message}</p>
      <div className="grid">
        <ProductForm onSubmit={handleCreateOrUpdate} selectedProduct={selectedProduct} onCancel={() => setSelectedProduct(null)} />
        <ProductTable products={products} onEdit={setSelectedProduct} onDelete={handleDelete} />
      </div>
    </div>
  );
}

export default Dashboard;
