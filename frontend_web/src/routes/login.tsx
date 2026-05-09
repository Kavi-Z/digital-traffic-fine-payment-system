import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { authApi, saveAuthData } from '@/lib/api';
import { Shield, Loader2, Lock } from 'lucide-react';

export const Route = createFileRoute('/login')({
  component: LoginRoute,
});

function LoginRoute() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.login(username, password);
      saveAuthData(data);
      if (data.role === 'OFFICER') {
        window.location.href = '/officer';
      } else {
        window.location.href = '/admin';
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-noise flex items-center justify-center px-4">
      <div className="ornate-card p-10 max-w-md w-full">
        <div className="text-center mb-4 text-[var(--gold-primary)] flex justify-center">
          <Shield size={48} />
        </div>
        <h1 className="text-2xl font-display gold-gradient-text text-center">Official Access</h1>
        <p className="text-center text-cream/70 text-sm font-serif mt-1">Sri Lanka Police Department</p>
        <div className="ornate-divider"><span>❖</span></div>

        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block">
            <span className="block font-display tracking-widest text-xs uppercase text-[var(--gold-primary)] mb-1">Username</span>
            <input
              className="typewriter-input w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </label>
          <label className="block">
            <span className="block font-display tracking-widest text-xs uppercase text-[var(--gold-primary)] mb-1">Password</span>
            <input
              type="password"
              className="typewriter-input w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && (
            <div className="text-[var(--crimson)] text-sm font-serif text-center">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full gold-btn py-3 font-display tracking-widest uppercase text-sm flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
          <p className="text-center text-cream/40 text-xs mt-4 font-serif">
            Admin: <code>admin / Admin@123</code> · Officer: <code>officer001 / Officer@123</code>
          </p>
        </form>
      </div>
    </div>
  );
}