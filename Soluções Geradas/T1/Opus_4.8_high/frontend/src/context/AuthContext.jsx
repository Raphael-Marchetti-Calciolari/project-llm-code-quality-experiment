import { createContext, useContext, useState } from 'react';
import { getToken, setToken } from '../api/client.js';
import { login as loginRequest } from '../api/auth.js';

const AuthContext = createContext(null);

/**
 * Provê o estado de autenticação do administrador para toda a aplicação.
 * O token é persistido no localStorage para manter a sessão entre recargas.
 */
export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());

  async function login(username, password) {
    const data = await loginRequest(username, password);
    setToken(data.token);
    setTokenState(data.token);
  }

  function logout() {
    setToken(null);
    setTokenState(null);
  }

  const value = {
    token,
    isAuthenticated: Boolean(token),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider.');
  }
  return context;
}
