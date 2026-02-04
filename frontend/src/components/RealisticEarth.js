import { useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';

function Earth() {
    const earthRef = useRef();

    const earthTexture = useTexture({
        map: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
        normalMap: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
        specularMap: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg',
    });

    useFrame(({ clock }) => {
        if (earthRef.current) {
            earthRef.current.rotation.y = clock.getElapsedTime() * 0.1;
        }
    });

    return (
        <Sphere ref={earthRef} args={[2.5, 64, 64]}>
            <meshPhongMaterial
                map={earthTexture.map}
                normalMap={earthTexture.normalMap}
                specularMap={earthTexture.specularMap}
                shininess={10}
            />
        </Sphere>
    );
}

function Atmosphere() {
    return (
        <Sphere args={[2.7, 64, 64]}>
            <meshBasicMaterial
                color="#4ade80"
                transparent
                opacity={0.15}
                side={THREE.BackSide}
            />
        </Sphere>
    );
}

function Clouds() {
    const cloudsRef = useRef();

    useFrame(({ clock }) => {
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
        }
    });

    return (
        <Sphere ref={cloudsRef} args={[2.52, 64, 64]}>
            <meshPhongMaterial
                map={useTexture('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png')}
                transparent
                opacity={0.4}
            />
        </Sphere>
    );
}

export default function RealisticEarth() {
    return (
        <div style={{ width: '100%', height: '100%', background: 'transparent' }}>
            <Canvas
                camera={{ position: [0, 0, 8], fov: 45 }}
                style={{ background: 'transparent' }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.3} />
                    <directionalLight position={[5, 3, 5]} intensity={1.5} color="#ffffff" />
                    <pointLight position={[-5, -3, -5]} intensity={0.5} color="#4ade80" />

                    <Stars
                        radius={100}
                        depth={50}
                        count={5000}
                        factor={4}
                        saturation={0}
                        fade
                        speed={0.5}
                    />

                    <Earth />
                    <Clouds />
                    <Atmosphere />

                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate
                        autoRotateSpeed={0.3}
                        minPolarAngle={Math.PI / 3}
                        maxPolarAngle={2 * Math.PI / 3}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
