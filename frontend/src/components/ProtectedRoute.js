import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/landing');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--deep-ocean) 0%, var(--midnight-blue) 50%, var(--ocean-blue) 100%)',
            }}>
                <motion.div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1.5rem'
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)'
                        }}
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 360]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    >
                        <Leaf style={{ width: '40px', height: '40px', color: '#ffffff' }} />
                    </motion.div>
                    <motion.p
                        style={{
                            fontSize: '1.125rem',
                            color: 'var(--text-secondary)',
                            fontWeight: '500'
                        }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        Loading...
                    </motion.p>
                </motion.div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return children;
}
