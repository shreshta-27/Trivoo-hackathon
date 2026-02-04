import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function FloatingLeaf({ position, scale, rotationSpeed }) {
  const meshRef = useRef();
  const floatOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + floatOffset) * 0.3;
      meshRef.current.rotation.z += rotationSpeed;
      meshRef.current.rotation.y += rotationSpeed * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <planeGeometry args={[0.3, 0.5]} />
      <meshStandardMaterial
        color="#4CAF50"
        side={THREE.DoubleSide}
        transparent
        opacity={0.7}
        emissive="#2E7D32"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

function ParticleField() {
  const particlesRef = useRef();
  const particleCount = 100;

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#9DC4A5"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function GlowingSphere() {
  const sphereRef = useRef();

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Sphere ref={sphereRef} args={[1.5, 64, 64]} position={[0, 0, 0]}>
      <MeshDistortMaterial
        color="#7BA882"
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0.2}
        metalness={0.8}
        emissive="#4CAF50"
        emissiveIntensity={0.3}
      />
    </Sphere>
  );
}

export default function Nature3DScene() {
  const leaves = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 3,
      ],
      scale: Math.random() * 0.5 + 0.3,
      rotationSpeed: (Math.random() - 0.5) * 0.01,
    }));
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', background: 'transparent' }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#F5F3EE" />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#9DC4A5" />

        <GlowingSphere />
        <ParticleField />

        {leaves.map((leaf, i) => (
          <FloatingLeaf
            key={i}
            position={leaf.position}
            scale={leaf.scale}
            rotationSpeed={leaf.rotationSpeed}
          />
        ))}

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
