import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@civivolt.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch {
      setError('Invalid login');
    }
  };

  return (
    <div className="h-screen grid place-items-center bg-slate-100">
      <form className="bg-white p-8 rounded-xl shadow w-full max-w-sm" onSubmit={submit}>
        <h1 className="text-2xl font-semibold mb-4">CIVIVOLT Login</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input className="border p-2 rounded w-full mb-3" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="border p-2 rounded w-full mb-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="bg-slate-900 text-white px-4 py-2 rounded w-full">Sign in</button>
      </form>
    </div>
  );
}
