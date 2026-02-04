import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function RiskSignalCard({ icon: Icon, title, severity, location, description, type = 'default' }) {
    const getStyles = () => {
        switch (type) {
            case 'fire':
                return {
                    iconBg: 'rgba(239, 68, 68, 0.2)',
                    iconColor: '#ef4444',
                    badgeBg: 'rgba(239, 68, 68, 0.25)',
                    badgeColor: '#ef4444'
                };
            case 'drought':
                return {
                    iconBg: 'rgba(251, 191, 36, 0.2)',
                    iconColor: '#fbbf24',
                    badgeBg: 'rgba(251, 191, 36, 0.25)',
                    badgeColor: '#fbbf24'
                };
            case 'human':
                return {
                    iconBg: 'rgba(74, 222, 128, 0.2)',
                    iconColor: '#4ade80',
                    badgeBg: 'rgba(74, 222, 128, 0.25)',
                    badgeColor: '#4ade80'
                };
            default:
                return {
                    iconBg: 'rgba(74, 222, 128, 0.2)',
                    iconColor: '#4ade80',
                    badgeBg: 'rgba(74, 222, 128, 0.25)',
                    badgeColor: '#4ade80'
                };
        }
    };

    const styles = getStyles();
    const isHighRisk = severity === 'High';

    return (
        <motion.div
            className={`risk-card ${isHighRisk ? 'high-risk' : ''}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                    padding: '0.75rem',
                    borderRadius: '8px',
                    background: styles.iconBg,
                    flexShrink: 0
                }}>
                    <Icon style={{ width: '22px', height: '22px', color: styles.iconColor }} />
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                        <div>
                            <h3 style={{
                                color: '#ffffff',
                                fontWeight: '600',
                                fontSize: '0.9375rem',
                                marginBottom: '0.375rem',
                                letterSpacing: '0.01em'
                            }}>
                                {title}
                            </h3>
                            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8125rem' }}>
                                {location}
                            </p>
                        </div>
                        {severity && (
                            <span style={{
                                padding: '0.375rem 0.75rem',
                                borderRadius: '6px',
                                fontSize: '0.6875rem',
                                fontWeight: '600',
                                background: styles.badgeBg,
                                color: styles.badgeColor,
                                whiteSpace: 'nowrap'
                            }}>
                                {severity}
                            </span>
                        )}
                    </div>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.55)',
                        fontSize: '0.8125rem',
                        marginBottom: '0.75rem',
                        lineHeight: '1.4'
                    }}>
                        {description}
                    </p>
                    <motion.button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontSize: '0.8125rem',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            fontWeight: '500'
                        }}
                        whileHover={{ x: 3, color: 'rgba(255, 255, 255, 0.7)' }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <ChevronRight style={{ width: '16px', height: '16px' }} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
