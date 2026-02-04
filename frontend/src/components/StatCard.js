import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, type = 'default' }) {
    const getColors = () => {
        switch (type) {
            case 'warning':
                return {
                    iconBg: 'rgba(251, 146, 60, 0.2)',
                    iconColor: '#fb923c'
                };
            case 'danger':
                return {
                    iconBg: 'rgba(239, 68, 68, 0.2)',
                    iconColor: '#ef4444'
                };
            default:
                return {
                    iconBg: 'rgba(74, 222, 128, 0.2)',
                    iconColor: '#4ade80'
                };
        }
    };

    const colors = getColors();

    return (
        <motion.div
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    background: colors.iconBg
                }}>
                    <Icon style={{ width: '22px', height: '22px', color: colors.iconColor }} />
                </div>
                <div style={{ flex: 1 }}>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.65)',
                        fontSize: '0.8125rem',
                        fontWeight: '500',
                        marginBottom: '0.5rem',
                        letterSpacing: '0.01em'
                    }}>
                        {label}
                    </p>
                    <p style={{
                        fontSize: '2.25rem',
                        fontWeight: '600',
                        color: '#ffffff',
                        lineHeight: '1',
                        letterSpacing: '-0.02em'
                    }}>
                        {value}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
