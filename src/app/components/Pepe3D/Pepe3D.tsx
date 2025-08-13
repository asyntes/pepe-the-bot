'use client';

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function Pepe3D() {
    const mountRef = useRef<HTMLDivElement>(null);
    const modelRef = useRef<THREE.Group | null>(null);
    const [morphValue, setMorphValue] = useState(0); // Stato per morph (0-1)

    useEffect(() => {
        if (!mountRef.current) return;

        // Setup scena (eseguito solo una volta)
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Luci
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);
        
        // Additional lights for better illumination
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight2.position.set(-5, 5, -5);
        scene.add(directionalLight2);
        
        const pointLight = new THREE.PointLight(0xffffff, 0.6, 50);
        pointLight.position.set(0, 10, 0);
        scene.add(pointLight);

        // Carica modello
        const loader = new GLTFLoader();
        loader.load('/models/pepe.glb', (gltf) => {
            const model = gltf.scene;
            model.scale.set(2, 2, 2);
            scene.add(model);
            modelRef.current = model;

            // Log per debug: Controlla se ha morph targets
            model.traverse((child) => {
                if (child instanceof THREE.Mesh && child.morphTargetInfluences) {
                    console.log('Morph targets trovati:', child.morphTargetInfluences.length);
                }
            });
        });

        // Orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 4, 0);
        camera.position.set(0, 4, 3);
        controls.update();

        // Animazione loop (applica morph qui, senza ri-creare)
        const animate = () => {
            requestAnimationFrame(animate);
            if (modelRef.current) {
                modelRef.current.rotation.y += 0.005;

                // Applica morphing dinamicamente
                modelRef.current.traverse((child) => {
                    if (child instanceof THREE.Mesh && child.morphTargetInfluences) {
                        child.morphTargetInfluences[0] = morphValue; // Indice 0 per esempio; cambia se necessario
                    }
                });
            }
            renderer.render(scene, camera);
        };
        animate();

        // Resize handler
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            mountRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []); // Dependency vuota: Esegui solo al mount

    return (
        <div className="relative w-full h-screen">
            <div ref={mountRef} className="w-full h-full" />
            <button 
                onClick={() => setMorphValue((prev) => (prev === 0 ? 1 : 0))}
                className="absolute top-4 left-4 z-10 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Toggle Morph
            </button>
        </div>
    );
}