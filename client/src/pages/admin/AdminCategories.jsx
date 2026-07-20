// pages/admin/AdminCategories.jsx - CRUD for categories

import { useEffect, useState } from "react";
import api from "../../services/api.js";

const EMPTY = { name: "", slug: "", description: "" };

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setErr("");
    setShowForm(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({ name: c.name, slug: c.slug, description: c.description });
    setErr("");
    setShowForm(true);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const slugify = () =>
    setForm((f) => ({
      ...f,
      slug:
        f.slug ||
        f.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/admin/categories/${editing._id}`, form);
      } else {
        await api.post("/admin/categories", form);
      }
      setShowForm(false);
      await load();
    } catch (e2) {
      setErr(e2.response?.data?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c) => {
    if (!confirm(`Delete "${c.name}"?`)) return;
    try {
      await api.delete(`/admin/categories/${c._id}`);
      setCategories((prev) => prev.filter((x) => x._id !== c._id));
    } catch (e) {
      alert(e.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">Organize your catalog into categories.</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add Category
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="card no-pad">
          <div className="table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c._id}>
                    <td className="cell-name">{c.name}</td>
                    <td><code>{c.slug}</code></td>
                    <td>{c.description}</td>
                    <td className="row-actions">
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(c)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={4} className="empty">No categories yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <div className="drawer-backdrop" onClick={() => setShowForm(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <h3>{editing ? "Edit Category" : "New Category"}</h3>
              <button className="drawer-close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="drawer-form">
              <label>
                Name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={slugify}
                  required
                />
              </label>
              <label>
                Slug
                <input name="slug" value={form.slug} onChange={handleChange} required />
              </label>
              <label>
                Description
                <textarea
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                />
              </label>

              {err && <div className="form-error">{err}</div>}

              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : editing ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCategories;