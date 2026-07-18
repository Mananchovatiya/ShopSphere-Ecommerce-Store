// pages/admin/AdminProducts.jsx - CRUD for products with a slide-over form

import { useEffect, useState } from "react";
import api from "../../services/api.js";
import { formatCurrency } from "../../utils/format.js";

const EMPTY = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "",
  brand: "",
  stock: "",
  featured: false,
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [{ data: prod }, { data: cats }] = await Promise.all([
        api.get("/products", { params: { limit: 100, search } }),
        api.get("/categories"),
      ]);
      setProducts(prod.products);
      setCategories(cats);
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setErr("");
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image,
      category: p.category,
      brand: p.brand,
      stock: p.stock,
      featured: !!p.featured,
    });
    setErr("");
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };
      if (editing) {
        await api.put(`/admin/products/${editing._id}`, payload);
      } else {
        await api.post("/admin/products", payload);
      }
      setShowForm(false);
      await load();
    } catch (e2) {
      setErr(e2.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p) => {
    if (!confirm(`Delete "${p.name}"?`)) return;
    try {
      await api.delete(`/admin/products/${p._id}`);
      setProducts((prev) => prev.filter((x) => x._id !== p._id));
    } catch (e) {
      alert(e.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">Manage the products in your catalog.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add Product
        </button>
      </div>

      <div className="admin-toolbar">
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
        />
        <button className="btn btn-outline btn-sm" onClick={load}>
          Search
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card no-pad">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className="cell-product">
                      <img src={p.image} alt={p.name} />
                      <div>
                        <div className="cell-name">{p.name}</div>
                        <div className="cell-sub">{p.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>{formatCurrency(p.price)}</td>
                  <td>{p.stock}</td>
                  <td>{p.featured ? "Yes" : "No"}</td>
                  <td className="row-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="drawer-backdrop" onClick={() => setShowForm(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <h3>{editing ? "Edit Product" : "New Product"}</h3>
              <button className="drawer-close" onClick={() => setShowForm(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="drawer-form">
              <label>
                Name
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>
              <label>
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                />
              </label>
              <div className="form-grid">
                <label>
                  Price (₹)
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="1"
                    value={form.price}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Stock
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={handleChange}
                    required
                  />
                </label>
                <label>
                  Category
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select...</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Brand
                  <input name="brand" value={form.brand} onChange={handleChange} />
                </label>
              </div>
              <label>
                Image URL
                <input name="image" value={form.image} onChange={handleChange} />
              </label>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                />
                Show on homepage as featured
              </label>

              {err && <div className="form-error">{err}</div>}

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : editing ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
