import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';

function Earth() {
    const earthRef = useRef();
    const cloudsRef = useRef();
    const atmosphereRef = useRef();
    const networkLinesRef = useRef();

    // Rotate the Earth continuously
    useFrame((state) => {
        if (earthRef.current) {
            earthRef.current.rotation.y += 0.001;
        }
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y += 0.0008;
        }
        if (networkLinesRef.current) {
            networkLinesRef.current.rotation.y += 0.001;
        }
    });

    // Create Earth texture
    const earthTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        // Ocean base
        const oceanGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        oceanGradient.addColorStop(0, '#0a1628');
        oceanGradient.addColorStop(0.5, '#1a2a48');
        oceanGradient.addColorStop(1, '#0a1628');
        ctx.fillStyle = oceanGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw continents with realistic colors
        ctx.fillStyle = '#3a4a2a';

        // Africa
        ctx.beginPath();
        ctx.ellipse(1100, 550, 200, 280, 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Europe
        ctx.beginPath();
        ctx.ellipse(1050, 350, 150, 100, 0, 0, Math.PI * 2);
        ctx.fill();

        // Asia
        ctx.beginPath();
        ctx.ellipse(1400, 380, 350, 220, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // North America
        ctx.beginPath();
        ctx.ellipse(400, 350, 200, 250, -0.2, 0, Math.PI * 2);
        ctx.fill();

        // South America
        ctx.beginPath();
        ctx.ellipse(500, 650, 150, 200, 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Australia
        ctx.beginPath();
        ctx.ellipse(1600, 700, 130, 90, 0, 0, Math.PI * 2);
        ctx.fill();

        // Add golden/brown highlights to land
        ctx.fillStyle = 'rgba(139, 115, 85, 0.4)';
        for (let i = 0; i < 5000; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            ctx.fillRect(x, y, 3, 3);
        }

        // Add green vegetation
        ctx.fillStyle = 'rgba(90, 120, 60, 0.3)';
        for (let i = 0; i < 3000; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            ctx.fillRect(x, y, 2, 2);
        }

        return new THREE.CanvasTexture(canvas);
    }, []);

    // Network lines geometry
    const networkLines = useMemo(() => {
        const points = [];
        const numLines = 20;

        for (let i = 0; i < numLines; i++) {
            const lat = (Math.random() - 0.5) * Math.PI;
            const lon = Math.random() * Math.PI * 2;

            for (let j = 0; j <= 50; j++) {
                const t = j / 50;
                const currentLon = lon + t * Math.PI * 2;
                const radius = 2.05;

                const x = radius * Math.cos(lat) * Math.cos(currentLon);
                const y = radius * Math.sin(lat);
                const z = radius * Math.cos(lat) * Math.sin(currentLon);

                points.push(new THREE.Vector3(x, y, z));
            }
        }

        return points;
    }, []);

    return (
        <group>
            {/* Stars background */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {/* Main Earth */}
            <Sphere ref={earthRef} args={[2, 64, 64]}>
                <meshStandardMaterial
                    map={earthTexture}
                    roughness={0.7}
                    metalness={0.1}
                />
            </Sphere>

            {/* Clouds layer */}
            <Sphere ref={cloudsRef} args={[2.01, 64, 64]}>
                <meshStandardMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.05}
                    roughness={1}
                />
            </Sphere>

            {/* Glowing golden atmosphere */}
            <Sphere ref={atmosphereRef} args={[2.15, 64, 64]}>
                <meshBasicMaterial
                    color="#fbbf24"
                    transparent
                    opacity={0.15}
                    side={THREE.BackSide}
                />
            </Sphere>

            {/* Outer glow */}
            <Sphere args={[2.25, 64, 64]}>
                <meshBasicMaterial
                    color="#fb923c"
                    transparent
                    opacity={0.08}
                    side={THREE.BackSide}
                />
            </Sphere>

            {/* Golden network lines */}
            <group ref={networkLinesRef}>
                {networkLines.map((point, i) => {
                    if (i % 51 === 0 || i % 51 === 50) return null;
                    const nextPoint = networkLines[i + 1];
                    if (!nextPoint) return null;

                    return (
                        <line key={i}>
                            <bufferGeometry>
                                <bufferAttribute
                                    attach="attributes-position"
                                    count={2}
                                    array={new Float32Array([
                                        point.x, point.y, point.z,
                                        nextPoint.x, nextPoint.y, nextPoint.z
                                    ])}
                                    itemSize={3}
                                />
                            </bufferGeometry>
                            <lineBasicMaterial color="#fbbf24" transparent opacity={0.3} />
                        </line>
                    );
                })}
            </group>

            {/* Connection points (glowing dots) */}
            {[
                { lat: 18.5204, lon: 73.8567 }, // Pune
                { lat: 19.9975, lon: 73.7898 }, // Nashik
                { lat: 21.1458, lon: 79.0882 }, // Nagpur
                { lat: 28.7041, lon: 77.1025 }, // Delhi
                { lat: 51.5074, lon: -0.1278 }, // London
                { lat: 40.7128, lon: -74.0060 }, // New York
            ].map((loc, i) => {
                const phi = (90 - loc.lat) * (Math.PI / 180);
                const theta = (loc.lon + 180) * (Math.PI / 180);
                const radius = 2.06;
                const x = -(radius * Math.sin(phi) * Math.cos(theta));
                const z = radius * Math.sin(phi) * Math.sin(theta);
                const y = radius * Math.cos(phi);

                return (
                    <group key={i}>
                        <mesh position={[x, y, z]}>
                            <sphereGeometry args={[0.03, 16, 16]} />
                            <meshBasicMaterial color="#fbbf24" />
                        </mesh>
                        <pointLight position={[x, y, z]} color="#fbbf24" intensity={1} distance={0.5} />
                    </group>
                );
            })}
        </group>
    );
}

export default function AnimatedGlobe() {
    return (
        <div style={{ width: '100%', height: '100%', background: '#000000' }}>
            <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
                {/* Lighting setup for realistic Earth */}
                <ambientLight intensity={0.3} />
                <directionalLight position={[5, 3, 5]} intensity={1.5} color="#ffffff" />
                <directionalLight position={[-3, -2, -3]} intensity={0.2} color="#4a5a6a" />
                <pointLight position={[10, 0, 0]} intensity={0.5} color="#fbbf24" />

                <Earth />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.5}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={3 * Math.PI / 4}
                />
            </Canvas>
        </div>
    );
}
