import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import RegionTable from '../components/RegionTable';
import RiskSignalCard from '../components/RiskSignalCard';
import { Leaf, TreeDeciduous, AlertTriangle, Flame, Droplet, Users, Globe, ChevronDown } from 'lucide-react';

const AnimatedGlobe = dynamic(() => import('../components/AnimatedGlobe'), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner"></div>
    </div>
  ),
});

export default function Home() {
  return (
    <Layout>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 style={{
            fontSize: '1.625rem',
            fontWeight: '600',
            color: '#ffffff',
            letterSpacing: '0.01em'
          }}>
            Forest Health Overview
          </h1>
          <motion.button
            className="btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(30, 42, 25, 0.7), rgba(20, 30, 18, 0.8))',
              border: '1px solid rgba(100, 130, 80, 0.3)',
              color: '#ffffff',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
            whileHover={{
              borderColor: 'rgba(120, 150, 100, 0.5)',
              background: 'linear-gradient(135deg, rgba(35, 48, 30, 0.8), rgba(25, 35, 23, 0.9))'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Globe style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
            <span>Worldwide</span>
            <ChevronDown style={{ width: '14px', height: '14px', color: '#9ca3af' }} />
          </motion.button>
        </motion.div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.75rem',
          marginBottom: '2rem'
        }}>
          {/* Left: Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <StatCard icon={Leaf} label="Total Regions" value="5" type="default" />
            <StatCard icon={TreeDeciduous} label="Total Projects" value="18" type="default" />
            <StatCard icon={AlertTriangle} label="Projects at Risk" value="4" type="warning" />
            <StatCard icon={Flame} label="Critical Alerts" value="2" type="danger" />
          </div>

          {/* Right: Globe */}
          <motion.div
            style={{
              height: '380px',
              borderRadius: '12px',
              overflow: 'hidden'
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <AnimatedGlobe />
          </motion.div>
        </div>

        {/* Region Overview */}
        <motion.div
          style={{ marginBottom: '2rem' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: '1rem',
            letterSpacing: '0.01em'
          }}>
            Region Overview
          </h2>
          <RegionTable />
        </motion.div>

        {/* Active Risk Signals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: '1rem',
            letterSpacing: '0.01em'
          }}>
            Active Risk Signals
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem'
          }}>
            <RiskSignalCard
              icon={Flame}
              title="Fire Risk"
              severity="High"
              location="Nashik Zone"
              description="Below avg rainfall"
              type="fire"
            />
            <RiskSignalCard
              icon={Droplet}
              title="Drought Stress"
              severity=""
              location="Pune"
              description="Below avg rainfall"
              type="drought"
            />
            <RiskSignalCard
              icon={Users}
              title="Human Activity"
              severity=""
              location="Nagpur Zone"
              description="+2.1°C Temperature Anomaly"
              type="human"
            />
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
