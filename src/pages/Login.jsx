import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';
import Button from '../components/UI/Button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login, register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const isRegister = mode === 'register';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setErrorMessage('');
    const result = isRegister
      ? await register({ name, email, password })
      : await login(email, password);
    setBusy(false);

    if (!result.success) {
      setErrorMessage(result.message);
      return;
    }

    addToast(isRegister ? 'Account created and signed in.' : 'Authentication successful.', 'success');
    navigate('/dashboard', { replace: true });
  };

  const switchMode = () => {
    setMode((current) => current === 'login' ? 'register' : 'login');
    setErrorMessage('');
  };

  return (
    <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="auth-card">
      <div className="auth-card-heading">
        <p className="eyebrow">SECURE ACCESS</p>
        <h2>{isRegister ? 'Create your account' : 'Welcome back'}</h2>
        <p>{isRegister ? 'Set up your Sentinel account to begin enrollment.' : 'Sign in to review your active session and behavioural security.'}</p>
      </div>

      {errorMessage && <div className="inline-error" role="alert">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        {isRegister && (
          <label className="form-field">
            <span>Full name</span>
            <div className="input-with-icon"><UserRound size={18} /><input autoComplete="name" type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" minLength={2} maxLength={100} required /></div>
          </label>
        )}
        <label className="form-field">
          <span>Email address</span>
          <div className="input-with-icon"><Mail size={18} /><input autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" maxLength={254} required /></div>
        </label>
        <label className="form-field">
          <span>Password</span>
          <div className="input-with-icon"><LockKeyhole size={18} /><input autoComplete={isRegister ? 'new-password' : 'current-password'} type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isRegister ? 'At least 10 characters' : 'Enter your password'} minLength={isRegister ? 10 : undefined} maxLength={128} required /><button className="password-visibility" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
        </label>
        <Button type="submit" isLoading={busy} style={{ marginTop: '8px' }}>
          {isRegister ? 'Create account' : 'Sign in'} <ArrowRight size={18} />
        </Button>
      </form>

      <div className="auth-switch-row">
        <span>{isRegister ? 'Already have an account?' : 'New to Sentinel?'}</span>
        <button type="button" onClick={switchMode}>{isRegister ? 'Sign in' : 'Create account'}</button>
      </div>
      {isRegister && <p className="auth-small-note">Passwords must be 10–128 characters. Do not reuse a password from another account.</p>}
    </motion.section>
  );
};

export default Login;
