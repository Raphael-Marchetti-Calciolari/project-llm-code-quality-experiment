import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, setToken } from "../api.js";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const { token } = await api.login(email, password);
      setToken(token);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="container narrow">
      <h1>Login administrativo</h1>
      <form onSubmit={submit}>
        <label>
          E-mail
          <input data-testid="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Senha
          <input data-testid="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button data-testid="login-submit" type="submit">Entrar</button>
      </form>
    </div>
  );
}
