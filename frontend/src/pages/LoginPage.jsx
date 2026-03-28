import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FormInput from "../components/FormInput";
import LogoMark from "../components/LogoMark";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const user = await login(form);
      navigate(user.role === "admin" ? "/admin" : user.role === "donor" ? "/donor" : "/requester");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-teal-50 px-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="card w-full max-w-md">
        <LogoMark />
        <h1 className="mt-6">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Sign in to manage donors, requests, and lifesaving matches.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <FormInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
          <FormInput label="Password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter your password" />
          <button className="btn-primary w-full" disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">
          Don’t have an account?{" "}
          <Link to="/signup" className="font-semibold text-brand-primary">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
