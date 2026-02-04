import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { X, Eye, EyeOff, Leaf } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialView = 'login' }) {
    const router = useRouter();
    const [view, setView] = useState(initialView);
    const [showPassword, setShowPassword] = useState(false);

    // Form states
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Update view when initialView changes
    useEffect(() => {
        setView(initialView);
    }, [initialView]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Navigate to dashboard
        router.push('/dashboard');
    };

    const switchView = (newView) => {
        setView(newView);
        // Reset form
        setFullName('');
        setEmail('');
        setPassword('');
        setShowPassword(false);
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
                                marginBottom: '2rem',
                            }}
                            key={view}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {view === 'login' ? 'Welcome Back' : 'Create Account'}
                        </motion.h2>

                        {/* Form */}
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
                                        {/* Email Field */}
                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <label
                                                style={{
                                                    display: 'block',
                                                    fontSize: '0.9375rem',
                                                    color: 'var(--emerald-green)',
                                                    marginBottom: '0.5rem',
                                                    fontWeight: '500',
                                                }}
                                            >
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your email"
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '0.875rem 1rem',
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px solid var(--glass-border)',
                                                    borderRadius: '10px',
                                                    color: 'var(--text-primary)',
                                                    fontSize: '0.9375rem',
                                                    outline: 'none',
                                                    transition: 'all 0.3s',
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = 'var(--emerald-green)';
                                                    e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'var(--glass-border)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            />
                                        </div>

                                        {/* Password Field */}
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label
                                                style={{
                                                    display: 'block',
                                                    fontSize: '0.9375rem',
                                                    color: 'var(--emerald-green)',
                                                    marginBottom: '0.5rem',
                                                    fontWeight: '500',
                                                }}
                                            >
                                                Password
                                            </label>
                                            <div style={{ position: 'relative' }}>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Enter your password"
                                                    required
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.875rem 3rem 0.875rem 1rem',
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        border: '1px solid var(--glass-border)',
                                                        borderRadius: '10px',
                                                        color: 'var(--text-primary)',
                                                        fontSize: '0.9375rem',
                                                        outline: 'none',
                                                        transition: 'all 0.3s',
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = 'var(--emerald-green)';
                                                        e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = 'var(--glass-border)';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    style={{
                                                        position: 'absolute',
                                                        right: '1rem',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        padding: 0,
                                                        color: 'var(--text-secondary)',
                                                    }}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff style={{ width: '18px', height: '18px' }} />
                                                    ) : (
                                                        <Eye style={{ width: '18px', height: '18px' }} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Login Button */}
                                        <motion.button
                                            type="submit"
                                            style={{
                                                width: '100%',
                                                padding: '1rem',
                                                background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                                                border: 'none',
                                                borderRadius: '10px',
                                                color: '#ffffff',
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                                            }}
                                            whileHover={{
                                                scale: 1.02,
                                                boxShadow: '0 6px 30px rgba(16, 185, 129, 0.6)',
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Log In
                                        </motion.button>

                                        {/* Switch to Sign Up */}
                                        <div
                                            style={{
                                                textAlign: 'center',
                                                marginTop: '1.5rem',
                                                color: 'var(--text-secondary)',
                                                fontSize: '0.9375rem',
                                            }}
                                        >
                                            Don't have an account?{' '}
                                            <button
                                                type="button"
                                                onClick={() => switchView('signup')}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'var(--emerald-green)',
                                                    cursor: 'pointer',
                                                    fontWeight: '600',
                                                    fontSize: '0.9375rem',
                                                    padding: 0,
                                                    textDecoration: 'underline',
                                                }}
                                            >
                                                Sign Up
                                            </button>
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
                                        {/* Full Name Field */}
                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <label
                                                style={{
                                                    display: 'block',
                                                    fontSize: '0.9375rem',
                                                    color: 'var(--emerald-green)',
                                                    marginBottom: '0.5rem',
                                                    fontWeight: '500',
                                                }}
                                            >
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="Enter your full name"
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '0.875rem 1rem',
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px solid var(--glass-border)',
                                                    borderRadius: '10px',
                                                    color: 'var(--text-primary)',
                                                    fontSize: '0.9375rem',
                                                    outline: 'none',
                                                    transition: 'all 0.3s',
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = 'var(--emerald-green)';
                                                    e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'var(--glass-border)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            />
                                        </div>

                                        {/* Email Field */}
                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <label
                                                style={{
                                                    display: 'block',
                                                    fontSize: '0.9375rem',
                                                    color: 'var(--emerald-green)',
                                                    marginBottom: '0.5rem',
                                                    fontWeight: '500',
                                                }}
                                            >
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your email"
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '0.875rem 1rem',
                                                    background: 'rgba(255, 255, 255, 0.05)',
                                                    border: '1px solid var(--glass-border)',
                                                    borderRadius: '10px',
                                                    color: 'var(--text-primary)',
                                                    fontSize: '0.9375rem',
                                                    outline: 'none',
                                                    transition: 'all 0.3s',
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = 'var(--emerald-green)';
                                                    e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                                                }}
                                                onBlur={(e) => {
                                                    e.target.style.borderColor = 'var(--glass-border)';
                                                    e.target.style.boxShadow = 'none';
                                                }}
                                            />
                                        </div>

                                        {/* Password Field */}
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <label
                                                style={{
                                                    display: 'block',
                                                    fontSize: '0.9375rem',
                                                    color: 'var(--emerald-green)',
                                                    marginBottom: '0.5rem',
                                                    fontWeight: '500',
                                                }}
                                            >
                                                Password
                                            </label>
                                            <div style={{ position: 'relative' }}>
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Create a password"
                                                    required
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.875rem 3rem 0.875rem 1rem',
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        border: '1px solid var(--glass-border)',
                                                        borderRadius: '10px',
                                                        color: 'var(--text-primary)',
                                                        fontSize: '0.9375rem',
                                                        outline: 'none',
                                                        transition: 'all 0.3s',
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = 'var(--emerald-green)';
                                                        e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = 'var(--glass-border)';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    style={{
                                                        position: 'absolute',
                                                        right: '1rem',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        background: 'none',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        padding: 0,
                                                        color: 'var(--text-secondary)',
                                                    }}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff style={{ width: '18px', height: '18px' }} />
                                                    ) : (
                                                        <Eye style={{ width: '18px', height: '18px' }} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Create Account Button */}
                                        <motion.button
                                            type="submit"
                                            style={{
                                                width: '100%',
                                                padding: '1rem',
                                                background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                                                border: 'none',
                                                borderRadius: '10px',
                                                color: '#ffffff',
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                                            }}
                                            whileHover={{
                                                scale: 1.02,
                                                boxShadow: '0 6px 30px rgba(16, 185, 129, 0.6)',
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Create Account
                                        </motion.button>

                                        {/* Switch to Login */}
                                        <div
                                            style={{
                                                textAlign: 'center',
                                                marginTop: '1.5rem',
                                                color: 'var(--text-secondary)',
                                                fontSize: '0.9375rem',
                                            }}
                                        >
                                            Already have an account?{' '}
                                            <button
                                                type="button"
                                                onClick={() => switchView('login')}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'var(--emerald-green)',
                                                    cursor: 'pointer',
                                                    fontWeight: '600',
                                                    fontSize: '0.9375rem',
                                                    padding: 0,
                                                    textDecoration: 'underline',
                                                }}
                                            >
                                                Log In
                                            </button>
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
