'use client'
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useCanvasContext } from '@/hooks/useCanvas';
import Canvas from '@/components/Canvas';

import vert from './shaders/vert.glsl';
import frag from './shaders/frag.glsl';
import uniforms from './uniforms';
import Pixelating from '@/components/Pixelating/Pixelating';

const Scene = () => {
    const pixelatingCanvasRef = useRef<HTMLCanvasElement>(null);
    const { context } = useCanvasContext();
    let material: THREE.MeshBasicMaterial;
    const resolutions = [
        { width: 16, height: 16 },
        { width: 32, height: 32 },
        { width: 64, height: 64 },
        { width: 128, height: 128 },
        { width: 256, height: 256 },
        { width: 512, height: 512 },
    ];
    let currentResolutionIndex = 0;
    useEffect(() => {
        if (context) {
            const scene = new THREE.Scene();
            const width = context.canvas.width;
            const height = context.canvas.height
            const camera = new THREE.PerspectiveCamera(
                90,
                width / height,
                0.1,
                1000,
            );

            const renderer = new THREE.WebGLRenderer({ canvas: context.canvas });

            const geometry = new THREE.PlaneGeometry(2.0, 2.0);
            material = new THREE.MeshBasicMaterial();

            // set canvas as material.map (this could be done to any map, bump, displacement etc.)
            if (pixelatingCanvasRef.current) {
                material.map = new THREE.CanvasTexture(pixelatingCanvasRef.current);
                material.map.magFilter = THREE.NearestFilter;
                material.map.minFilter = THREE.LinearMipMapLinearFilter;
            }

            const plane = new THREE.Mesh(geometry, material);
            scene.add(plane);


            renderer.setSize(width, height);

            const pointer = new THREE.Vector2(-999, -999);
            const rayCaster = new THREE.Raycaster();
            const canvas = context.canvas as HTMLCanvasElement;
            const rect = canvas.getBoundingClientRect();

            const pointerDown = (event: MouseEvent) => {
                // calculate pointer position in normalized device coordinates
                // (-1 to +1) for both components
                pointer.x = ((event.clientX - rect.left) / context.canvas.width) * 2 - 1;
                pointer.y = -((event.clientY - rect.top) / context.canvas.height) * 2 + 1;
                rayCaster.setFromCamera(pointer, camera);
                // calculate objects intersecting the picking ray
                const intersects = rayCaster.intersectObjects([plane], false);
                const uv = intersects[0]?.uv;
                if (intersects.length > 0 && uv) {
                    const { width, height } = resolutions[currentResolutionIndex];
                    uniforms.iMouse.data = [
                        Math.floor((uv.x - 0.5) * width),
                        Math.floor((uv.y - 0.5) * height),
                    ];
                }

            };
            canvas.addEventListener('pointerdown', pointerDown);

            camera.position.z = 2.0;
            const animate = () => {
                if (material.map) {
                    material.map.needsUpdate = true;
                }
                renderer.render(scene, camera);
            };

            renderer.setAnimationLoop(animate);
        }
    }, [context]);

    const onRatioChange = (pixelatingCanvasContext: WebGL2RenderingContext, inputValue: number) => {
        if (material) {
            currentResolutionIndex = inputValue;
            material.map = new THREE.CanvasTexture(pixelatingCanvasContext.canvas);
            material.map.magFilter = THREE.NearestFilter;
            material.map.minFilter = THREE.LinearMipMapLinearFilter;
        }
    };

    //const windowDimensions = useWindowDimensions();
    return (
        <Canvas className={/*`w-512 h-256 pixelated m-0.5 hidden`*/`hidden`}
                width={resolutions[currentResolutionIndex].width}
                height={resolutions[currentResolutionIndex].height}
                ref={pixelatingCanvasRef}>
            {
                context &&
                <Pixelating
                    resolutions={resolutions}
                    defaultResolution={currentResolutionIndex}
                    onRatioChange={onRatioChange}
                    shaders={{ vert, frag, uniforms }}
                />
            }
        </Canvas>
    );
};

export default Scene;
