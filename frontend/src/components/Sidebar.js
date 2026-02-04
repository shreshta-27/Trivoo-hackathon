import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Map,
    FolderKanban,
    Lightbulb,
    FlaskConical,
    Newspaper,
    Bot,
    Globe
} from 'lucide-react';

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Map View', icon: Map, path: '/map-view' },
    { name: 'My Projects', icon: FolderKanban, path: '/my-projects' },
    { name: 'Recommended Actions', icon: Lightbulb, path: '/recommended-actions' },
    { name: 'Simulation Mode', icon: FlaskConical, path: '/simulation-mode' },
    { name: 'Incidents / News', icon: Newspaper, path: '/incidents' },
    { name: 'AI Assistant', icon: Bot, path: '/ai-assistant' },
];

export default function Sidebar() {
    const router = useRouter();

    return (
        <div className="sidebar" style={{
            width: '175px',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Logo */}
            <div style={{
                padding: '1.5rem 1rem',
                borderBottom: '1px solid rgba(80, 120, 80, 0.2)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Globe style={{ width: '24px', height: '24px', color: '#6b7280' }} />
                    <span style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        letterSpacing: '0.1em',
                        color: '#ffffff'
                    }}>TRIVO</span>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = router.pathname === item.path;

                    return (
                        <motion.button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className={`sidebar-item ${isActive ? 'active' : ''}`}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.625rem 0.75rem',
                                textAlign: 'left',
                                border: 'none',
                                background: isActive ? 'rgba(40, 60, 40, 0.6)' : 'transparent',
                                borderLeft: isActive ? '3px solid #4ade80' : '3px solid transparent',
                                color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: '500'
                            }}
                            whileHover={{ x: 2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                            <span>{item.name}</span>
                        </motion.button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div style={{
                padding: '1rem',
                borderTop: '1px solid rgba(80, 120, 80, 0.2)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.75rem' }}>
                    <Globe style={{ width: '14px', height: '14px' }} />
                    <span>TRIVO</span>
                </div>
            </div>
        </div>
    );
}
