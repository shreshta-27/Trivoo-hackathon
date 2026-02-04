import Sidebar from './Sidebar';
import dynamic from 'next/dynamic';

const RealisticEarth = dynamic(() => import('./RealisticEarth'), {
    ssr: false,
    loading: () => <div className="spinner"></div>,
});

const ParticleBackground = dynamic(() => import('./ParticleBackground'), {
    ssr: false,
});

export default function DashboardLayout({ children, activePage = 'dashboard' }) {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, var(--deep-ocean) 0%, var(--midnight-blue) 50%, var(--ocean-blue) 100%)',
            color: 'var(--text-primary)',
            display: 'flex',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background Effects */}
            <ParticleBackground />

            {/* Rotating Earth Background */}
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

            {/* Sidebar */}
            <Sidebar activePage={activePage} />

            {/* Main Content */}
            <main style={{
                marginLeft: '280px',
                flex: 1,
                padding: '2rem',
                position: 'relative',
                zIndex: 1,
                overflowY: 'auto',
                height: '100vh',
            }}>
                {children}
            </main>
        </div>
    );
}
