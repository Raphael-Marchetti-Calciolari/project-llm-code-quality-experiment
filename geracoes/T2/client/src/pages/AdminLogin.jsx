import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken } from '../api.js';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { token } = await api('/admin/login', { method: 'POST', body: { email, password } });
      setToken(token);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="page form narrow" onSubmit={submit}>
      <h1>Login administrativo</h1>
      <label>E-mail
        <input data-testid="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label>Senha
        <input data-testid="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      {error && <p role="alert" className="error">{error}</p>}
      <button type="submit" data-testid="login-submit">Entrar</button>
    </form>
  );
}
