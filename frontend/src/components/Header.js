import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Menu, ChevronDown } from 'lucide-react';

export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <header className="header" style={{
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Worldwide Selector */}
                <div style={{ position: 'relative' }}>
                    <motion.button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            background: 'rgba(20, 30, 20, 0.6)',
                            border: '1px solid rgba(80, 120, 80, 0.3)',
                            color: '#ffffff',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                        }}
                        whileHover={{ borderColor: 'rgba(100, 150, 100, 0.5)' }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Globe style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
                        <span>Worldwide</span>
                        <ChevronDown style={{
                            width: '14px',
                            height: '14px',
                            color: '#9ca3af',
                            transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                        }} />
                    </motion.button>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 0.5rem)',
                                    left: 0,
                                    width: '180px',
                                    background: 'rgba(15, 25, 15, 0.95)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(80, 120, 80, 0.3)',
                                    borderRadius: '6px',
                                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                                    overflow: 'hidden',
                                    zIndex: 50
                                }}
                            >
                                {['Worldwide', 'Asia', 'Europe', 'Americas', 'Africa', 'Oceania'].map((region) => (
                                    <button
                                        key={region}
                                        onClick={() => setIsDropdownOpen(false)}
                                        style={{
                                            width: '100%',
                                            padding: '0.625rem 1rem',
                                            textAlign: 'left',
                                            fontSize: '0.875rem',
                                            color: '#ffffff',
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = 'rgba(30, 45, 30, 0.5)'}
                                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                                    >
                                        {region}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Menu Button */}
                <motion.button
                    style={{
                        padding: '0.5rem',
                        borderRadius: '6px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                    whileHover={{ background: 'rgba(30, 45, 30, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Menu style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
                </motion.button>

                {/* User Profile */}
                <motion.div
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #4ade80, #fbbf24)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#000000'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    U
                </motion.div>
            </div>
        </header>
    );
}
