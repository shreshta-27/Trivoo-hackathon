import { useState } from 'react';
import Sidebar from './Sidebar';
import dynamic from 'next/dynamic';
import { Menu, X } from 'lucide-react';

const RealisticEarth = dynamic(() => import('./RealisticEarth'), {
    ssr: false,
    loading: () => <div className="spinner"></div>,
});

const ParticleBackground = dynamic(() => import('./ParticleBackground'), {
    ssr: false,
});

export default function DashboardLayout({ children, activePage = 'dashboard' }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, var(--deep-ocean) 0%, var(--midnight-blue) 50%, var(--ocean-blue) 100%)',
            color: 'var(--text-primary)',
            display: 'flex',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <ParticleBackground />

            <div style={{
                position: 'fixed',
                right: '-200px',
                bottom: '-200px',
                width: '800px',
                height: '800px',
                opacity: 0.15,
                pointerEvents: 'none',
                zIndex: 0,
            }}>
                <RealisticEarth />
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                    position: 'fixed',
                    top: '1rem',
                    left: '1rem',
                    zIndex: 1001,
                    background: 'rgba(16, 185, 129, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    cursor: 'pointer',
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--emerald-green)',
                    transition: 'all 0.3s ease',
                }}
                className="mobile-menu-btn"
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar with responsive behavior */}
            <div
                style={{
                    position: 'fixed',
                    left: sidebarOpen ? '0' : '-280px',
                    top: 0,
                    height: '100vh',
                    width: '280px',
                    zIndex: 1000,
                    transition: 'left 0.3s ease',
                }}
                className="sidebar-container"
            >
                <Sidebar activePage={activePage} />
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 999,
                        display: 'none',
                    }}
                    className="sidebar-overlay"
                />
            )}

            {/* Main content */}
            <main style={{
                marginLeft: '280px',
                flex: 1,
                padding: '2rem',
                position: 'relative',
                zIndex: 1,
                overflowY: 'auto',
                height: '100vh',
            }}
                className="main-content"
            >
                {children}
            </main>

            <style jsx>{`
                @media (max-width: 768px) {
                    .mobile-menu-btn {
                        display: flex !important;
                    }
                    
                    .sidebar-container {
                        left: ${sidebarOpen ? '0' : '-280px'} !important;
                    }
                    
                    .sidebar-overlay {
                        display: block !important;
                    }
                    
                    .main-content {
                        margin-left: 0 !important;
                        padding: 1rem !important;
                        padding-top: 4rem !important;
                    }
                }

                @media (min-width: 769px) {
                    .sidebar-container {
                        left: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
}