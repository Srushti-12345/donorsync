import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import FormInput from "../components/FormInput";
import LogoMark from "../components/LogoMark";

const initialState = {
  name: "",
  email: "",
  password: "",
  phone: "",
  bloodGroup: "A+",
  location: "",
  role: "requester",
  age: "",
  gender: "Male",
  city: "",
  state: ""
};

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const user = await signup({
        ...form,
        age: form.age ? Number(form.age) : undefined
      });
      navigate(user.role === "donor" ? "/donor" : "/requester");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-teal-50 px-4 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="card w-full max-w-3xl">
        <LogoMark />
        <h1 className="mt-6">Create your DonorSync account</h1>

        <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <FormInput label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
          <FormInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
          <FormInput label="Password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Create password" />
          <FormInput label="Phone" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9876543210" />

          <label className="space-y-2">
            <span className="text-sm font-medium">Blood Group</span>
            <select className="input" name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                <option key={group}>{group}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium">Role</span>
            <select className="input" name="role" value={form.role} onChange={handleChange}>
              <option value="requester">Requester</option>
              <option value="donor">Donor</option>
            </select>
          </label>

          <div className="sm:col-span-2">
            <FormInput label="Location" name="location" value={form.location} onChange={handleChange} placeholder="City, Area" />
          </div>

          {form.role === "donor" && (
            <>
              <FormInput label="Age" name="age" type="number" value={form.age} onChange={handleChange} placeholder="25" />
              <label className="space-y-2">
                <span className="text-sm font-medium">Gender</span>
                <select className="input" name="gender" value={form.gender} onChange={handleChange}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </label>
              <FormInput label="City" name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" />
              <FormInput label="State" name="state" value={form.state} onChange={handleChange} placeholder="Maharashtra" />
            </>
          )}

          <div className="sm:col-span-2">
            <button className="btn-primary w-full" disabled={submitting}>
              {submitting ? "Creating account..." : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
