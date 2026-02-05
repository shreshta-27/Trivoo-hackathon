import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { X, Eye, EyeOff, Leaf } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialView = 'login' }) {
    const router = useRouter();
    const [view, setView] = useState(initialView);
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profession, setProfession] = useState('NGOs & Environmental Organization');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setView(initialView);
        setError('');
    }, [initialView]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = view === 'login'
            ? 'http://localhost:5000/api/users/login'
            : 'http://localhost:5000/api/users/register';

        const body = view === 'login'
            ? { email, password }
            : { name: fullName, email, password, profession };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            localStorage.setItem('userInfo', JSON.stringify(data));
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            router.push('/dashboard');
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    const switchView = (newView) => {
        setView(newView);
        setFullName('');
        setEmail('');
        setPassword('');
        setProfession('NGOs & Environmental Organization');
        setShowPassword(false);
        setError('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(10, 25, 47, 0.8)',
                            backdropFilter: 'blur(8px)',
                            zIndex: 9998,
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '100%',
                            maxWidth: '460px',
                            background: 'var(--glass-dark)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '20px',
                            padding: '2.5rem',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(16, 185, 129, 0.2)',
                            zIndex: 9999,
                        }}
                        initial={{ opacity: 0, scale: 0.9, y: '-45%' }}
                        animate={{ opacity: 1, scale: 1, y: '-50%' }}
                        exit={{ opacity: 0, scale: 0.9, y: '-45%' }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <motion.button
                            onClick={onClose}
                            style={{
                                position: 'absolute',
                                top: '1.25rem',
                                right: '1.25rem',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '8px',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'var(--text-secondary)',
                            }}
                            whileHover={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderColor: 'var(--emerald-green)',
                                color: 'var(--emerald-green)',
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <X style={{ width: '20px', height: '20px' }} />
                        </motion.button>

                        {/* Logo */}
                        <motion.div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                marginBottom: '2rem',
                            }}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                                }}
                            >
                                <Leaf style={{ width: '26px', height: '26px', color: '#ffffff' }} />
                            </div>
                            <span
                                style={{
                                    fontSize: '1.75rem',
                                    fontWeight: '700',
                                    letterSpacing: '0.02em',
                                    background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                TRIVO
                            </span>
                        </motion.div>

                        {/* Title */}
                        <motion.h2
                            style={{
                                fontSize: '1.875rem',
                                fontWeight: '600',
                                color: 'var(--text-primary)',
                                textAlign: 'center',
                                marginBottom: '1.5rem',
                            }}
                            key={view}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {view === 'login' ? 'Welcome Back' : 'Create Account'}
                        </motion.h2>

                        {/* Google Login Button */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <motion.button
                                onClick={handleGoogleLogin}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    background: 'var(--glass-white)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '10px',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9375rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem'
                                }}
                                whileHover={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    borderColor: 'var(--emerald-green)'
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </motion.button>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '1.5rem',
                            color: 'var(--text-muted)',
                            fontSize: '0.875rem'
                        }}>
                            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                            or
                            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid #ef4444',
                                    color: '#ef4444',
                                    fontSize: '0.875rem',
                                    marginBottom: '1.5rem',
                                    textAlign: 'center'
                                }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <AnimatePresence mode="wait">
                                {view === 'login' ? (
                                    <motion.div
                                        key="login"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.9375rem', color: 'var(--emerald-green)', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your email"
                                                required
                                                style={{ width: '100%', padding: '0.875rem 1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.9375rem', outline: 'none', transition: 'all 0.3s' }}
                                                onFocus={(e) => { e.target.style.borderColor = 'var(--emerald-green)'; e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)'; }}
                                                onBlur={(e) => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.boxShadow = 'none'; }}
                                            />
                                        </div>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.9375rem', color: 'var(--emerald-green)', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
                                            <div style={{ position: 'relative' }}>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Enter your password"
                                                    required
                                                    style={{ width: '100%', padding: '0.875rem 3rem 0.875rem 1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.9375rem', outline: 'none', transition: 'all 0.3s' }}
                                                    onFocus={(e) => { e.target.style.borderColor = 'var(--emerald-green)'; e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)'; }}
                                                    onBlur={(e) => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.boxShadow = 'none'; }}
                                                />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-secondary)' }}>
                                                    {showPassword ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
                                                </button>
                                            </div>
                                        </div>
                                        <motion.button type="submit" disabled={loading} style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))', border: 'none', borderRadius: '10px', color: '#ffffff', fontSize: '1rem', fontWeight: '600', cursor: loading ? 'wait' : 'pointer', boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)', opacity: loading ? 0.7 : 1 }} whileHover={{ scale: 1.02, boxShadow: '0 6px 30px rgba(16, 185, 129, 0.6)' }} whileTap={{ scale: 0.98 }}>
                                            {loading ? 'Logging in...' : 'Log In'}
                                        </motion.button>
                                        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                                            Don't have an account? <button type="button" onClick={() => switchView('signup')} style={{ background: 'none', border: 'none', color: 'var(--emerald-green)', cursor: 'pointer', fontWeight: '600', fontSize: '0.9375rem', padding: 0, textDecoration: 'underline' }}>Sign Up</button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="signup"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.9375rem', color: 'var(--emerald-green)', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="Enter your full name"
                                                required
                                                style={{ width: '100%', padding: '0.875rem 1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.9375rem', outline: 'none', transition: 'all 0.3s' }}
                                                onFocus={(e) => { e.target.style.borderColor = 'var(--emerald-green)'; e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)'; }}
                                                onBlur={(e) => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.boxShadow = 'none'; }}
                                            />
                                        </div>
                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.9375rem', color: 'var(--emerald-green)', marginBottom: '0.5rem', fontWeight: '500' }}>Profession</label>
                                            <select
                                                value={profession}
                                                onChange={(e) => setProfession(e.target.value)}
                                                style={{ width: '100%', padding: '0.875rem 1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.9375rem', outline: 'none', transition: 'all 0.3s' }}
                                                onFocus={(e) => { e.target.style.borderColor = 'var(--emerald-green)'; e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)'; }}
                                                onBlur={(e) => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.boxShadow = 'none'; }}
                                            >
                                                <option value="NGOs & Environmental Organization" style={{ color: 'black' }}>NGOs & Environmental Organization</option>
                                                <option value="Government / Forest Department Officials" style={{ color: 'black' }}>Government / Forest Department Officials</option>
                                                <option value="CSR / Corporate Sustainability Teams" style={{ color: 'black' }}>CSR / Corporate Sustainability Teams</option>
                                                <option value="Field Officers / Ground Staff" style={{ color: 'black' }}>Field Officers / Ground Staff</option>
                                                <option value="System Admin" style={{ color: 'black' }}>System Admin</option>
                                            </select>
                                        </div>
                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.9375rem', color: 'var(--emerald-green)', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your email"
                                                required
                                                style={{ width: '100%', padding: '0.875rem 1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.9375rem', outline: 'none', transition: 'all 0.3s' }}
                                                onFocus={(e) => { e.target.style.borderColor = 'var(--emerald-green)'; e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)'; }}
                                                onBlur={(e) => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.boxShadow = 'none'; }}
                                            />
                                        </div>
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.9375rem', color: 'var(--emerald-green)', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
                                            <div style={{ position: 'relative' }}>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Create a password"
                                                    required
                                                    style={{ width: '100%', padding: '0.875rem 3rem 0.875rem 1rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'var(--text-primary)', fontSize: '0.9375rem', outline: 'none', transition: 'all 0.3s' }}
                                                    onFocus={(e) => { e.target.style.borderColor = 'var(--emerald-green)'; e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)'; }}
                                                    onBlur={(e) => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.boxShadow = 'none'; }}
                                                />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-secondary)' }}>
                                                    {showPassword ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
                                                </button>
                                            </div>
                                        </div>
                                        <motion.button type="submit" disabled={loading} style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))', border: 'none', borderRadius: '10px', color: '#ffffff', fontSize: '1rem', fontWeight: '600', cursor: loading ? 'wait' : 'pointer', boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)', opacity: loading ? 0.7 : 1 }} whileHover={{ scale: 1.02, boxShadow: '0 6px 30px rgba(16, 185, 129, 0.6)' }} whileTap={{ scale: 0.98 }}>
                                            {loading ? 'Creating Account...' : 'Create Account'}
                                        </motion.button>
                                        <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                                            Already have an account? <button type="button" onClick={() => switchView('login')} style={{ background: 'none', border: 'none', color: 'var(--emerald-green)', cursor: 'pointer', fontWeight: '600', fontSize: '0.9375rem', padding: 0, textDecoration: 'underline' }}>Log In</button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}