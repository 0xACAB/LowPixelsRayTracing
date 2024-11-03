'use client'; // Indicates that this component is client-side only

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Playground= () => {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const animationIdRef = useRef<number | null>(null); // To store the animation frame ID

    useEffect(() => {
        // Initialize the WebGL renderer if it doesn't already exist
        if (!rendererRef.current && mountRef.current) {
            rendererRef.current = new THREE.WebGLRenderer();
            rendererRef.current.setSize(window.innerWidth, window.innerHeight);
            mountRef.current.appendChild(rendererRef.current.domElement);

            // Basic Three.js scene setup
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;

            // Create a triangle geometry
            const geometry = new THREE.BufferGeometry();
            const vertices = new Float32Array([
                0, 1, 0,  // Vertex 1 (X, Y, Z)
                -1, -1, 0, // Vertex 2 (X, Y, Z)
                1, -1, 0   // Vertex 3 (X, Y, Z)
            ]);
            geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const triangle = new THREE.Mesh(geometry, material);
            scene.add(triangle);

            const animate = () => {
                triangle.rotation.z += 0.01; // Rotate the triangle
                rendererRef.current?.render(scene, camera);
                animationIdRef.current = requestAnimationFrame(animate);
            };
            animate();
        }

        // Cleanup function to dispose of WebGL resources
        return () => {
            if (rendererRef.current) {
                // Cancel the animation frame
                if (animationIdRef.current) {
                    cancelAnimationFrame(animationIdRef.current);
                    animationIdRef.current = null;
                }

                // Dispose of the WebGL renderer
                rendererRef.current.dispose();
                if (mountRef.current) {
                    mountRef.current.removeChild(rendererRef.current.domElement);
                }
                rendererRef.current = null;
            }
        };
    }, []); // Empty dependency array to run effect only on mount and unmount

    return <div ref={mountRef} />;
};

export default Playground;