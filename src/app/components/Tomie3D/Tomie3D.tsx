'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function Tomie3D() {
    const mountRef = useRef<HTMLDivElement>(null);
    const modelRef = useRef<THREE.Group | null>(null);
    const mixerRef = useRef<THREE.AnimationMixer | null>(null);
    const clockRef = useRef<THREE.Clock>(new THREE.Clock());

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

        const loader = new GLTFLoader();
        loader.load('/models/tomie.glb', (gltf) => {
            const model = gltf.scene;
            model.scale.set(2, 2, 2);
            scene.add(model);
            modelRef.current = model;

            if (gltf.animations && gltf.animations.length > 0) {
                const mixer = new THREE.AnimationMixer(model);
                mixerRef.current = mixer;
                
                const walkAction = mixer.clipAction(gltf.animations[0]);
                walkAction.play();
            }
        });

        const controls = new OrbitControls(camera, renderer.domElement);

        camera.position.set(0, 0, 5);
        controls.update();

        const animate = () => {
            requestAnimationFrame(animate);
            
            const delta = clockRef.current.getDelta();
            if (mixerRef.current) {
                mixerRef.current.update(delta);
            }
            
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (mixerRef.current) {
                mixerRef.current.stopAllAction();
            }
            mountRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return (
        <div className="w-full h-screen">
            <div ref={mountRef} className="w-full h-full" />
        </div>
    );
}