import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import {
    LayoutDashboard,
    Map,
    FolderKanban,
    Lightbulb,
    Zap,
    AlertCircle,
    Bot,
    Leaf
} from 'lucide-react';

export default function Sidebar({ activePage = 'dashboard' }) {
    const router = useRouter();

    const navItems = [
        { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, route: '/dashboard' },
        { id: 'map-view', name: 'Map View', icon: Map, route: '/map-view' },
        { id: 'my-projects', name: 'My Projects', icon: FolderKanban, route: '/my-projects' },
        { id: 'recommended-actions', name: 'Recommended Actions', icon: Lightbulb, route: '/recommended-actions' },
        { id: 'simulation-mode', name: 'Simulation Mode', icon: Zap, route: '/simulation-mode' },
        { id: 'incidents', name: 'Incidents / News', icon: AlertCircle, route: '/incidents' },
        { id: 'ai-assistant', name: 'AI Assistant', icon: Bot, route: '/ai-assistant' },
    ];

    return (
        <motion.div
            style={{
                width: '280px',
                height: '100vh',
                background: 'var(--glass-dark)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: 100,
                padding: '2rem 1.5rem 2rem 0',
            }}
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            {/* Logo */}
            <motion.div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '3rem',
                    marginLeft: '1.25rem',
                    cursor: 'pointer',
                }}
                onClick={() => router.push('/dashboard')}
                whileHover={{ scale: 1.05 }}
            >
                <div
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
                    }}
                >
                    <Leaf style={{ width: '22px', height: '22px', color: '#ffffff' }} />
                </div>
                <span
                    style={{
                        fontSize: '1.5rem',
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

            {/* Navigation Items */}
            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;

                    return (
                        <motion.button
                            key={item.id}
                            onClick={() => router.push(item.route)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.875rem 1.25rem',
                                borderRadius: '0',
                                background: 'transparent',
                                border: 'none',
                                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                                fontSize: '0.9375rem',
                                fontWeight: isActive ? '600' : '500',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'all 0.3s ease',
                                textAlign: 'left',
                                borderLeft: isActive ? '4px solid var(--emerald-green)' : '4px solid transparent',
                            }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                            whileHover={{
                                backgroundColor: isActive
                                    ? 'rgba(16, 185, 129, 0.1)'
                                    : 'rgba(255, 255, 255, 0.05)',
                                color: 'var(--text-primary)',
                            }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Icon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
                            <span>{item.name}</span>
                        </motion.button>
                    );
                })}
            </nav>

            {/* User Section */}
            <motion.div
                style={{
                    padding: '1rem',
                    borderTop: '1px solid var(--glass-border)',
                    marginTop: '1rem',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                    }}
                >
                    <div
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--emerald-green), var(--bright-green))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: '#ffffff',
                        }}
                    >
                        U
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.125rem' }}>
                            User
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            user@trivo.io
                        </p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
