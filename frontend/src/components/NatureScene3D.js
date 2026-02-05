import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function NatureScene3D() {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x0a192f, 10, 50);

        const camera = new THREE.PerspectiveCamera(
            75,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(0, 3, 8);
        camera.lookAt(0, 2, 0);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.setClearColor(0x000000, 0);
        mountRef.current.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0x10b981, 0.8);
        directionalLight.position.set(5, 10, 5);
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0x22d3ee, 0.5);
        pointLight.position.set(-5, 5, -5);
        scene.add(pointLight);

        // Ground
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x0f4c3a,
            roughness: 0.8,
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0;
        scene.add(ground);

        // Grass blades
        const grassBlades = [];
        const grassGeometry = new THREE.ConeGeometry(0.02, 0.5, 3);
        const grassMaterial = new THREE.MeshStandardMaterial({
            color: 0x10b981,
            flatShading: true,
        });

        for (let i = 0; i < 200; i++) {
            const blade = new THREE.Mesh(grassGeometry, grassMaterial);
            blade.position.x = (Math.random() - 0.5) * 15;
            blade.position.z = (Math.random() - 0.5) * 15;
            blade.position.y = 0.25;
            blade.rotation.x = (Math.random() - 0.5) * 0.2;
            blade.rotation.z = (Math.random() - 0.5) * 0.2;
            blade.userData.initialRotation = { x: blade.rotation.x, z: blade.rotation.z };
            blade.userData.swaySpeed = 0.5 + Math.random() * 0.5;
            blade.userData.swayAmount = 0.1 + Math.random() * 0.1;
            scene.add(blade);
            grassBlades.push(blade);
        }

        // Trees
        const trees = [];
        for (let i = 0; i < 5; i++) {
            const tree = new THREE.Group();

            // Trunk
            const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.15, 1.5, 8);
            const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3728 });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.y = 0.75;
            tree.add(trunk);

            // Foliage (3 layers)
            for (let j = 0; j < 3; j++) {
                const foliageGeometry = new THREE.ConeGeometry(0.6 - j * 0.15, 0.8, 8);
                const foliageMaterial = new THREE.MeshStandardMaterial({
                    color: j === 0 ? 0x10b981 : j === 1 ? 0x059669 : 0x047857,
                });
                const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
                foliage.position.y = 1.5 + j * 0.5;
                tree.add(foliage);
            }

            tree.position.x = (Math.random() - 0.5) * 12;
            tree.position.z = -3 - Math.random() * 5;
            tree.scale.set(0.8 + Math.random() * 0.4, 0.8 + Math.random() * 0.4, 0.8 + Math.random() * 0.4);
            tree.userData.swaySpeed = 0.3 + Math.random() * 0.2;
            tree.userData.swayAmount = 0.05 + Math.random() * 0.05;
            scene.add(tree);
            trees.push(tree);
        }

        // Butterflies
        const butterflies = [];
        const butterflyGeometry = new THREE.Group();

        for (let i = 0; i < 8; i++) {
            const butterfly = new THREE.Group();

            // Wings
            const wingGeometry = new THREE.CircleGeometry(0.15, 6);
            const wingMaterial = new THREE.MeshStandardMaterial({
                color: i % 2 === 0 ? 0x22d3ee : 0x10b981,
                side: THREE.DoubleSide,
                emissive: i % 2 === 0 ? 0x22d3ee : 0x10b981,
                emissiveIntensity: 0.3,
            });

            const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
            leftWing.position.x = -0.1;
            leftWing.rotation.y = Math.PI / 6;
            butterfly.add(leftWing);

            const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
            rightWing.position.x = 0.1;
            rightWing.rotation.y = -Math.PI / 6;
            butterfly.add(rightWing);

            // Body
            const bodyGeometry = new THREE.CapsuleGeometry(0.02, 0.15, 4, 8);
            const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x1e293b });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.rotation.z = Math.PI / 2;
            butterfly.add(body);

            butterfly.position.x = (Math.random() - 0.5) * 10;
            butterfly.position.y = 1 + Math.random() * 3;
            butterfly.position.z = (Math.random() - 0.5) * 10;

            butterfly.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.02
            );
            butterfly.userData.wingSpeed = 5 + Math.random() * 3;
            butterfly.userData.leftWing = leftWing;
            butterfly.userData.rightWing = rightWing;

            scene.add(butterfly);
            butterflies.push(butterfly);
        }

        // Animation
        let time = 0;
        const animate = () => {
            requestAnimationFrame(animate);
            time += 0.016;

            // Animate grass
            grassBlades.forEach((blade) => {
                const sway = Math.sin(time * blade.userData.swaySpeed) * blade.userData.swayAmount;
                blade.rotation.x = blade.userData.initialRotation.x + sway;
                blade.rotation.z = blade.userData.initialRotation.z + sway * 0.5;
            });

            // Animate trees
            trees.forEach((tree) => {
                const sway = Math.sin(time * tree.userData.swaySpeed) * tree.userData.swayAmount;
                tree.rotation.z = sway;
            });

            // Animate butterflies
            butterflies.forEach((butterfly) => {
                // Wing flapping
                const flapAngle = Math.sin(time * butterfly.userData.wingSpeed) * 0.5;
                butterfly.userData.leftWing.rotation.y = Math.PI / 6 + flapAngle;
                butterfly.userData.rightWing.rotation.y = -Math.PI / 6 - flapAngle;

                // Movement
                butterfly.position.add(butterfly.userData.velocity);

                // Boundary check and bounce
                if (Math.abs(butterfly.position.x) > 8) {
                    butterfly.userData.velocity.x *= -1;
                }
                if (butterfly.position.y < 0.5 || butterfly.position.y > 5) {
                    butterfly.userData.velocity.y *= -1;
                }
                if (Math.abs(butterfly.position.z) > 8) {
                    butterfly.userData.velocity.z *= -1;
                }

                // Slight random direction change
                butterfly.userData.velocity.x += (Math.random() - 0.5) * 0.001;
                butterfly.userData.velocity.y += (Math.random() - 0.5) * 0.0005;
                butterfly.userData.velocity.z += (Math.random() - 0.5) * 0.001;

                // Limit velocity
                butterfly.userData.velocity.clampLength(0, 0.03);

                // Face direction of movement
                if (butterfly.userData.velocity.length() > 0.001) {
                    butterfly.lookAt(
                        butterfly.position.x + butterfly.userData.velocity.x,
                        butterfly.position.y + butterfly.userData.velocity.y,
                        butterfly.position.z + butterfly.userData.velocity.z
                    );
                }
            });

            // Gentle camera sway
            camera.position.x = Math.sin(time * 0.2) * 0.5;
            camera.lookAt(0, 2, 0);

            renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            if (!mountRef.current) return;
            camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 0,
            }}
        />
    );
}
