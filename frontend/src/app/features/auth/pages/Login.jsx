import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  
  const user = useSelector(state =>state.auth.user);
  const loading = useSelector(state=>state.auth.loading)



  const {handleLogin} = useAuth();

  const handleSubmitForm = (e) => {
    e.preventDefault();

    const payload = {
      email,
      password,
    };

    handleLogin(payload)
    navigate("/")

    setEmail("");
    setPassword("");
  };

  if(!loading && user){
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-700/50 bg-slate-900/80 p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(34,211,238,0.15)]">
        <h1 className="mb-2 text-center text-4xl font-bold bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
          Welcome Back
        </h1>

        <p className="mb-8 text-center text-slate-400">
          Login to your account
        </p>

        <form onSubmit={handleSubmitForm} className="space-y-5">
          <div>
            <label className="mb-2 block text-slate-300">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-slate-300">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold text-white transition hover:scale-[1.02]"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="cursor-pointer font-medium text-cyan-400 hover:text-cyan-300"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;