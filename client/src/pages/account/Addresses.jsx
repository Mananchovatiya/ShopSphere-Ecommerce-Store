// pages/account/Addresses.jsx - Saved shipping addresses CRUD

import { useEffect, useState } from "react";
import api from "../../services/api.js";
import Loader from "../../components/Loader.jsx";

const emptyForm = {
  label: "Home",
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get("/users/addresses")
      .then((res) => setAddresses(res.data))
      .catch((e) => setErr(e.response?.data?.message || "Failed to load addresses"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (addr) => {
    setEditingId(addr._id);
    setForm({ ...emptyForm, ...addr });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setErr("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      setSaving(true);
      const { data } = editingId
        ? await api.put(`/users/addresses/${editingId}`, form)
        : await api.post("/users/addresses", form);
      setAddresses(data);
      closeForm();
    } catch (e2) {
      setErr(e2.response?.data?.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      const { data } = await api.delete(`/users/addresses/${id}`);
      setAddresses(data);
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to delete");
    }
  };

  const handleSetDefault = async (addr) => {
    try {
      const { data } = await api.put(`/users/addresses/${addr._id}`, {
        ...addr,
        isDefault: true,
      });
      setAddresses(data);
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to update");
    }
  };

  if (loading) return <Loader label="Loading addresses..." />;

  return (
    <div>
      <div className="section-header" style={{ marginBottom: "1rem" }}>
        <div>
          <h1 className="page-title">Addresses</h1>
          <p className="page-subtitle">Manage your saved shipping addresses.</p>
        </div>
        {!showForm && (
          <button className="btn btn-primary" onClick={openAdd}>
            + Add Address
          </button>
        )}
      </div>

      {err && <div className="form-error">{err}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="card form-card">
          <h3>{editingId ? "Edit Address" : "Add New Address"}</h3>
          <div className="form-grid">
            <label>
              Label
              <input name="label" value={form.label} onChange={handleChange} />
            </label>
            <label>
              Full name
              <input name="fullName" value={form.fullName} onChange={handleChange} required />
            </label>
            <label>
              Phone
              <input name="phone" value={form.phone} onChange={handleChange} required />
            </label>
            <label className="full">
              Address
              <input name="address" value={form.address} onChange={handleChange} required />
            </label>
            <label>
              City
              <input name="city" value={form.city} onChange={handleChange} required />
            </label>
            <label>
              State
              <input name="state" value={form.state} onChange={handleChange} required />
            </label>
            <label>
              Postal Code
              <input name="postalCode" value={form.postalCode} onChange={handleChange} required />
            </label>
            <label>
              Country
              <input name="country" value={form.country} onChange={handleChange} required />
            </label>
            <label className="checkbox-row full">
              <input
                type="checkbox"
                name="isDefault"
                checked={!!form.isDefault}
                onChange={handleChange}
              />
              Set as default address
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save Address"}
            </button>
            <button type="button" className="btn btn-outline" onClick={closeForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="empty-state">
          <p>You haven't saved any addresses yet.</p>
        </div>
      ) : (
        <div className="address-grid">
          {addresses.map((a) => (
            <div key={a._id} className="address-card">
              <div className="address-head">
                <span className="address-label">{a.label}</span>
                {a.isDefault && <span className="badge-default">Default</span>}
              </div>
              <p>
                <strong>{a.fullName}</strong><br />
                {a.address}<br />
                {a.city}, {a.state} {a.postalCode}<br />
                {a.country}<br />
                Phone: {a.phone}
              </p>
              <div className="address-actions">
                <button className="btn btn-outline btn-sm" onClick={() => openEdit(a)}>
                  Edit
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleDelete(a._id)}
                >
                  Delete
                </button>
                {!a.isDefault && (
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleSetDefault(a)}
                  >
                    Set default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Addresses;
