import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Globe, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            router.push('/dashboard');
        } else {
            setError(result.error || 'Invalid credentials');
            setLoading(false);
        }
    };

    return (
        <div className="textured-bg" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <motion.div
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    background: 'rgba(20, 15, 10, 0.85)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(139, 115, 85, 0.3)',
                    borderRadius: '12px',
                    padding: '3rem 2.5rem',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
                }}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Logo */}
                <motion.div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        marginBottom: '2.5rem'
                    }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)'
                    }}>
                        <Globe style={{ width: '28px', height: '28px', color: '#000000' }} />
                    </div>
                    <span style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#f5f5dc',
                        letterSpacing: '0.1em'
                    }}>
                        TRIVO
                    </span>
                </motion.div>

                {/* Title */}
                <motion.h1
                    style={{
                        fontSize: '1.875rem',
                        fontWeight: '600',
                        color: '#f5f5dc',
                        textAlign: 'center',
                        marginBottom: '2rem'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Login
                </motion.h1>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 rounded bg-red-500/20 border border-red-500/40 text-red-300 text-sm text-center"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin}>
                    {/* Email */}
                    <motion.div
                        style={{ marginBottom: '1.5rem' }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <label style={{
                            display: 'block',
                            fontSize: '0.9375rem',
                            color: '#d4af37',
                            marginBottom: '0.5rem',
                            fontWeight: '500'
                        }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                background: 'rgba(30, 25, 20, 0.6)',
                                border: '1px solid rgba(139, 115, 85, 0.4)',
                                borderRadius: '8px',
                                color: '#f5f5dc',
                                fontSize: '0.9375rem',
                                outline: 'none',
                                transition: 'all 0.3s'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                            onBlur={(e) => e.target.style.borderColor = 'rgba(139, 115, 85, 0.4)'}
                        />
                    </motion.div>

                    {/* Password */}
                    <motion.div
                        style={{ marginBottom: '0.75rem' }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label style={{
                                fontSize: '0.9375rem',
                                color: '#d4af37',
                                fontWeight: '500'
                            }}>
                                Password
                            </label>
                            <button
                                type="button"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'rgba(212, 175, 55, 0.7)',
                                    fontSize: '0.8125rem',
                                    cursor: 'pointer',
                                    padding: 0
                                }}
                            >
                                Forgot password?
                            </button>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 3rem 0.875rem 1rem',
                                    background: 'rgba(30, 25, 20, 0.6)',
                                    border: '1px solid rgba(139, 115, 85, 0.4)',
                                    borderRadius: '8px',
                                    color: '#f5f5dc',
                                    fontSize: '0.9375rem',
                                    outline: 'none',
                                    transition: 'all 0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(139, 115, 85, 0.4)'}
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
                                    padding: 0
                                }}
                            >
                                {showPassword ? (
                                    <EyeOff style={{ width: '18px', height: '18px', color: 'rgba(212, 175, 55, 0.6)' }} />
                                ) : (
                                    <Eye style={{ width: '18px', height: '18px', color: 'rgba(212, 175, 55, 0.6)' }} />
                                )}
                            </button>
                        </div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: 'linear-gradient(135deg, rgba(90, 110, 60, 0.8), rgba(70, 90, 50, 0.9))',
                            border: '1px solid rgba(139, 115, 85, 0.5)',
                            borderRadius: '8px',
                            color: '#f5f5dc',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '1.5rem',
                            transition: 'all 0.3s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        whileHover={{
                            background: 'linear-gradient(135deg, rgba(100, 120, 70, 0.9), rgba(80, 100, 60, 1))',
                            boxShadow: '0 6px 20px rgba(90, 110, 60, 0.4)'
                        }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Log In'}
                    </motion.button>
                </form>

                {/* Footer */}
                <motion.div
                    style={{
                        textAlign: 'center',
                        marginTop: '2rem',
                        color: 'rgba(245, 245, 220, 0.7)',
                        fontSize: '0.9375rem'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    Don't have an account?{' '}
                    <button
                        onClick={() => router.push('/signup')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#d4af37',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontSize: '0.9375rem',
                            padding: 0
                        }}
                    >
                        Sign Up
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}