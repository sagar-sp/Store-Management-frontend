function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="card">
      <h3>Products</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.category || "-"}</td>
              <td>${Number(product.price).toFixed(2)}</td>
              <td>{product.stock}</td>
              <td className="row gap">
                <button className="secondary" onClick={() => onEdit(product)}>
                  Edit
                </button>
                <button className="danger" onClick={() => onDelete(product.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {!products.length && (
            <tr>
              <td colSpan="5">No products available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
