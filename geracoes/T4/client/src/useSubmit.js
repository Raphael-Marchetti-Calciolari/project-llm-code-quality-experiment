import { useState } from 'react';

export function useSubmit(action) {
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await action();
    } catch (err) {
      setError(err.message);
    }
  };

  return { submit, error };
}
