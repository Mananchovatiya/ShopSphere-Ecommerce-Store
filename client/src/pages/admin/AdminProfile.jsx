// pages/admin/AdminProfile.jsx - Admin's own profile + password settings,
// rendered inside the admin shell (sidebar stays visible, no customer navbar/footer).

import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import api from "../../services/api.js";

function AdminProfile() {
    const { user, updateUser } = useAuth();

    const [form, setForm] = useState({
        name: user?.name || "",
        phone: user?.phone || "",
    });
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");
    const [saving, setSaving] = useState(false);

    const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
    const [pwMsg, setPwMsg] = useState("");
    const [pwErr, setPwErr] = useState("");
    const [pwSaving, setPwSaving] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = async (e) => {
        e.preventDefault();
        setMsg("");
        setErr("");
        try {
            setSaving(true);
            const { data } = await api.put("/auth/profile", form);
            updateUser(data);
            setMsg("Profile updated");
        } catch (e2) {
            setErr(e2.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handlePwChange = (e) =>
        setPwForm({ ...pwForm, [e.target.name]: e.target.value });

    const handlePwSave = async (e) => {
        e.preventDefault();
        setPwMsg("");
        setPwErr("");
        try {
            setPwSaving(true);
            await api.put("/auth/password", pwForm);
            setPwForm({ currentPassword: "", newPassword: "" });
            setPwMsg("Password changed successfully");
        } catch (e2) {
            setPwErr(e2.response?.data?.message || "Failed to change password");
        } finally {
            setPwSaving(false);
        }
    };

    return (
        <div>
            <h1 className="page-title">My Profile</h1>
            <p className="page-subtitle">Manage your admin account information.</p>

            <form onSubmit={handleSave} className="card form-card">
                <h3>Personal Details</h3>

                <label>
                    Full Name
                    <input name="name" value={form.name} onChange={handleChange} required />
                </label>

                <label>
                    Email
                    <input value={user?.email || ""} disabled />
                </label>

                <label>
                    Phone
                    <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Optional"
                    />
                </label>

                {err && <div className="form-error">{err}</div>}
                {msg && <div className="form-success">{msg}</div>}

                <button className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>

            <form onSubmit={handlePwSave} className="card form-card">
                <h3>Change Password</h3>

                <label>
                    Current Password
                    <input
                        type="password"
                        name="currentPassword"
                        value={pwForm.currentPassword}
                        onChange={handlePwChange}
                        required
                    />
                </label>

                <label>
                    New Password
                    <input
                        type="password"
                        name="newPassword"
                        value={pwForm.newPassword}
                        onChange={handlePwChange}
                        required
                        minLength={6}
                    />
                </label>

                {pwErr && <div className="form-error">{pwErr}</div>}
                {pwMsg && <div className="form-success">{pwMsg}</div>}

                <button className="btn btn-primary" disabled={pwSaving}>
                    {pwSaving ? "Updating..." : "Update Password"}
                </button>
            </form>
        </div>
    );
}

export default AdminProfile;