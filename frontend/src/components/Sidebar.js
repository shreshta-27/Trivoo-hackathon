import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import {
    LayoutDashboard,
    Map,
    FolderKanban,
    Lightbulb,
    Zap,
    AlertCircle,
    Bot,
    Layers,
    LogOut,
} from 'lucide-react';
import { useState } from 'react';

export default function Sidebar({ activePage }) {
    const router = useRouter();
    const [hoveredItem, setHoveredItem] = useState(null);

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Map View', icon: Map, path: '/map-view' },
        { name: 'My Projects', icon: FolderKanban, path: '/my-projects' },
        { name: 'Recommended Actions', icon: Lightbulb, path: '/recommended-actions' },
        { name: 'Decision Sandbox', icon: Zap, path: '/simulation-mode' },
        { name: 'Incidents / News', icon: AlertCircle, path: '/incidents' },
        { name: 'AI Assistant', icon: Bot, path: '/ai-assistant' },
        { name: 'FutureScape', icon: Layers, path: '/futurescape' },
    ];

    return (
        <motion.div
            style={{
                width: '280px',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(16, 185, 129, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                padding: '2rem 1rem',
                zIndex: 1000,
                boxShadow: '0 0 60px rgba(16, 185, 129, 0.15), inset 0 0 60px rgba(16, 185, 129, 0.03)',
                overflow: 'hidden',
            }}
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            {/* Animated Background Gradient */}
            <motion.div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Floating Particles */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: 'absolute',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: 'rgba(16, 185, 129, 0.4)',
                        boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)',
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        pointerEvents: 'none',
                        zIndex: 0,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, Math.random() * 20 - 10, 0],
                        opacity: [0.2, 0.8, 0.2],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: 'easeInOut',
                    }}
                />
            ))}

            {/* Logo */}
            <motion.div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '3rem',
                    marginLeft: '1.25rem',
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 1,
                }}
                onClick={() => router.push('/dashboard')}
                whileHover={{ scale: 1.05 }}
            >
                <motion.div
                    style={{
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                    }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                >
                    {/* Glowing ring around logo */}
                    <motion.div
                        style={{
                            position: 'absolute',
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            border: '2px solid rgba(16, 185, 129, 0.3)',
                            pointerEvents: 'none',
                        }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5],
                            rotate: [0, 360],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                    <img
                        src="/logo.svg"
                        alt="Trivo Logo"
                        style={{
                            width: '100%',
                            height: '100%',
                            filter: 'drop-shadow(0 4px 16px rgba(16, 185, 129, 0.6))',
                        }}
                    />
                </motion.div>
                <motion.span
                    style={{
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        letterSpacing: '0.05em',
                        background: 'linear-gradient(135deg, #22d3ee, #10b981)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{
                        letterSpacing: '0.1em',
                        transition: { duration: 0.3 }
                    }}
                >
                    TRIVO
                </motion.span>
            </motion.div>

            {/* Navigation Items */}
            <nav style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.path.substring(1);
                    const isHovered = hoveredItem === item.name;

                    return (
                        <motion.div
                            key={item.name}
                            style={{
                                marginBottom: '0.5rem',
                                position: 'relative',
                            }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index, duration: 0.4 }}
                        >
                            {/* Active indicator - animated line */}
                            <AnimatePresence>
                                {isActive && (
                                    <motion.div
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: '50%',
                                            width: '4px',
                                            height: '70%',
                                            background: 'linear-gradient(180deg, #10b981, #22d3ee)',
                                            borderRadius: '0 4px 4px 0',
                                            boxShadow: '0 0 20px rgba(16, 185, 129, 0.8)',
                                        }}
                                        initial={{ scaleY: 0, y: '-50%' }}
                                        animate={{ scaleY: 1, y: '-50%' }}
                                        exit={{ scaleY: 0, y: '-50%' }}
                                        transition={{ duration: 0.3 }}
                                    />
                                )}
                            </AnimatePresence>

                            {/* Hover glow effect */}
                            <AnimatePresence>
                                {isHovered && !isActive && (
                                    <motion.div
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
                                            borderRadius: '12px',
                                            pointerEvents: 'none',
                                        }}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                )}
                            </AnimatePresence>

                            <motion.button
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem 1.25rem',
                                    background: isActive
                                        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(34, 211, 238, 0.1))'
                                        : 'transparent',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: isActive ? '#10b981' : 'var(--text-secondary)',
                                    fontSize: '0.9375rem',
                                    fontWeight: isActive ? '600' : '500',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    boxShadow: isActive
                                        ? '0 4px 20px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                                        : 'none',
                                }}
                                onClick={() => router.push(item.path)}
                                onHoverStart={() => setHoveredItem(item.name)}
                                onHoverEnd={() => setHoveredItem(null)}
                                whileHover={{
                                    x: 8,
                                    backgroundColor: isActive
                                        ? 'rgba(16, 185, 129, 0.2)'
                                        : 'rgba(255, 255, 255, 0.05)',
                                }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Shimmer effect on hover */}
                                <AnimatePresence>
                                    {isHovered && (
                                        <motion.div
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: '-100%',
                                                width: '100%',
                                                height: '100%',
                                                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                                                pointerEvents: 'none',
                                            }}
                                            initial={{ left: '-100%' }}
                                            animate={{ left: '100%' }}
                                            transition={{ duration: 0.6, ease: 'easeInOut' }}
                                        />
                                    )}
                                </AnimatePresence>

                                <motion.div
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    animate={isActive ? {
                                        rotate: [0, -10, 10, -10, 0],
                                        scale: [1, 1.1, 1],
                                    } : {}}
                                    transition={isActive ? {
                                        duration: 0.5,
                                        repeat: Infinity,
                                        repeatDelay: 3,
                                    } : {}}
                                    whileHover={{ scale: 1.2, rotate: 5 }}
                                >
                                    <Icon
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            filter: isActive
                                                ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))'
                                                : 'none',
                                        }}
                                    />
                                </motion.div>
                                <span>{item.name}</span>

                                {/* Pulse indicator for active item */}
                                {isActive && (
                                    <motion.div
                                        style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: '#10b981',
                                            marginLeft: 'auto',
                                            boxShadow: '0 0 10px rgba(16, 185, 129, 0.8)',
                                        }}
                                        animate={{
                                            scale: [1, 1.3, 1],
                                            opacity: [1, 0.6, 1],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                        }}
                                    />
                                )}
                            </motion.button>
                        </motion.div>
                    );
                })}
            </nav>

            {/* Logout Button */}
            <motion.div
                style={{
                    position: 'relative',
                    zIndex: 1,
                    marginTop: '2rem',
                    padding: '1rem',
                    borderTop: '1px solid rgba(16, 185, 129, 0.2)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
            >
                <motion.button
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        padding: '0.875rem 1.25rem',
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '12px',
                        color: '#ef4444',
                        fontSize: '0.9375rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
                    }}
                    onClick={() => {
                        // Clear any stored auth data if you have any
                        // localStorage.removeItem('authToken');
                        router.push('/landing');
                    }}
                    whileHover={{
                        scale: 1.05,
                        backgroundColor: 'rgba(239, 68, 68, 0.15)',
                        boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)',
                        borderColor: 'rgba(239, 68, 68, 0.5)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Animated glow effect */}
                    <motion.div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'radial-gradient(circle at center, rgba(239, 68, 68, 0.2) 0%, transparent 70%)',
                            pointerEvents: 'none',
                        }}
                        animate={{
                            opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />

                    <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <LogOut style={{ width: '18px', height: '18px' }} />
                    </motion.div>
                    <span>Logout</span>
                </motion.button>
            </motion.div>
        </motion.div>
    );
}
