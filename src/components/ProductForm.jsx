import { useEffect, useState } from "react";

const initialState = { name: "", category: "", price: "", stock: "" };

function ProductForm({ onSubmit, selectedProduct, onCancel }) {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name: selectedProduct.name || "",
        category: selectedProduct.category || "",
        price: selectedProduct.price || "",
        stock: selectedProduct.stock || "",
      });
    } else {
      setFormData(initialState);
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!selectedProduct) {
      setFormData(initialState);
    }
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <h3>{selectedProduct ? "Update Product" : "Add Product"}</h3>
      <input name="name" placeholder="Product name" value={formData.name} onChange={handleChange} required />
      <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
      <input name="price" type="number" step="0.01" placeholder="Price" value={formData.price} onChange={handleChange} required />
      <input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
      <div className="row gap">
        <button type="submit">{selectedProduct ? "Update" : "Create"}</button>
        {selectedProduct && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;
