import { useDispatch } from "react-redux";

import { register, login, getMe } from "../services/auth.api";

import { setLoading, setError, setUser } from "../auth.slice";

export function useAuth() {
  const dispatch = useDispatch();
  async function handleRegister({ email, username, password }) {
    try {
      dispatch(setLoading(true));
      const data = await register({ email, username, password });
    } catch (err) {
      dispatch(setError(err.response?.data?.message) || "registration failed");
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      const data = await login({ email, password });
      dispatch(setUser(data.user));
    } catch (err) {
      dispatch(setError(err.response?.data?.message) || "login failed");
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (err) {
       dispatch(setError(err.response?.data?.message) || "Failed to fetch user data");
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    handleGetMe,handleLogin,handleRegister
  }
}
