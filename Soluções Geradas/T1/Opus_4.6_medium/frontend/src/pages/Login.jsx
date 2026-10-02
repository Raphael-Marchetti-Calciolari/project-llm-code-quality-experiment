import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import '../styles.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const { token } = await api.login(email, password);
      localStorage.setItem('token', token);
      navigate('/admin/produtos');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="form-card">
      <h2>Acesso Administrativo</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>E-mail</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Senha</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Entrar</button>
      </form>
    </div>
  );
}
