import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const regions = [
    { name: 'Pune Zone', projects: 7, atRisk: 3, status: 'Below avg rainfall' },
    { name: 'Nashik Zone', projects: 6, atRisk: 1, status: 'Below avg rainfall' },
];

export default function RegionTable() {
    return (
        <div className="data-table">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid rgba(100, 130, 80, 0.2)' }}>
                        <th style={{
                            padding: '1rem 1.5rem',
                            textAlign: 'left',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.5)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Region
                        </th>
                        <th style={{
                            padding: '1rem 1.5rem',
                            textAlign: 'left',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.5)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Projects
                        </th>
                        <th style={{
                            padding: '1rem 1.5rem',
                            textAlign: 'left',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.5)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            At Risk
                        </th>
                        <th style={{
                            padding: '1rem 1.5rem',
                            textAlign: 'left',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.5)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            SOTIRE
                        </th>
                        <th style={{ padding: '1rem 1.5rem', width: '50px' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {regions.map((region, index) => (
                        <motion.tr
                            key={region.name}
                            className="table-row"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            whileHover={{ x: 3 }}
                            style={{ cursor: 'pointer' }}
                        >
                            <td style={{
                                padding: '1.125rem 1.5rem',
                                color: '#ffffff',
                                fontWeight: '500',
                                fontSize: '0.9375rem'
                            }}>
                                {region.name}
                            </td>
                            <td style={{
                                padding: '1.125rem 1.5rem',
                                color: '#ffffff',
                                fontSize: '0.9375rem'
                            }}>
                                {region.projects}
                            </td>
                            <td style={{
                                padding: '1.125rem 1.5rem',
                                fontSize: '0.9375rem'
                            }}>
                                <span style={{ color: '#fb923c', fontWeight: '600' }}>
                                    {region.atRisk}
                                </span>
                            </td>
                            <td style={{
                                padding: '1.125rem 1.5rem',
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '0.875rem'
                            }}>
                                {region.status}
                            </td>
                            <td style={{ padding: '1.125rem 1.5rem' }}>
                                <ChevronRight style={{ width: '18px', height: '18px', color: 'rgba(255, 255, 255, 0.4)' }} />
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
