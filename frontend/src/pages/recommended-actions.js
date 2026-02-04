import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import { Lightbulb } from 'lucide-react';

export default function RecommendedActions() {
    return (
        <DashboardLayout activePage="recommended-actions">
            <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center', paddingTop: '4rem' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 2rem',
                        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
                    }}>
                        <Lightbulb style={{ width: '40px', height: '40px', color: '#ffffff' }} />
                    </div>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        marginBottom: '1rem',
                        background: 'linear-gradient(135deg, var(--text-primary), var(--emerald-green))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        Recommended Actions
                    </h1>
                    <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                        AI-powered recommendations for at-risk projects coming soon.
                    </p>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
