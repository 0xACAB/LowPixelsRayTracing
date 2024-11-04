'use client'; // Indicates that this component is client-side only

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Playground = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null); // Renderer reference

    useEffect(() => {
        // Initialize the WebGL renderer if it doesn't already exist
        if (!rendererRef.current && canvasRef.current) {
            rendererRef.current = new THREE.WebGLRenderer({canvas: canvasRef.current});

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

            // Set up the animation loop using setAnimationLoop
            rendererRef.current.setAnimationLoop(() => {
                triangle.rotation.z += 0.01; // Rotate the triangle
                rendererRef.current?.render(scene, camera);
            });
        }

        // Cleanup function to dispose of WebGL resources
        return () => {
            if (rendererRef.current) {
                // Stop the animation loop
                rendererRef.current.setAnimationLoop(null); // This stops the loop
                console.log('Animation loop stopped');
                // Dispose of the WebGL renderer
                rendererRef.current.dispose();
                rendererRef.current = null;
            }
        };
    }, []); // Empty dependency array to run effect only on mount and unmount

    return <div>
        <canvas id="canvas" className={`pixelated`} width={512} height={512} ref={canvasRef}></canvas>
    </div>;
};

export default Playground;
