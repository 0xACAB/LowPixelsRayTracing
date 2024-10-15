import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';

import { useCanvasContext } from '@/hooks/useCanvas';
//import { useWindowDimensions } from '@/hooks/useWindowDimensions';
import Canvas from '@/components/Canvas';

import vert from './shaders/vert.glsl';
import frag from './shaders/frag.glsl';
import uniforms from './uniforms';
import Pixelating from '@/components/Pixelating/Pixelating';

const Test = () => {
    const pixelatingCanvasRef = useRef<HTMLCanvasElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);

    const { context } = useCanvasContext();
    let material: THREE.MeshBasicMaterial;
    useEffect(() => {
        if (context) {
            const stats = new Stats();
            if (statsRef.current) {
                statsRef.current.appendChild(stats.dom);
            }

            const scene = new THREE.Scene();
            const width = window.innerWidth;//context.canvas.width;
            const height = window.innerHeight * 0.9;//context.canvas.width;
            const camera = new THREE.PerspectiveCamera(
                90,
                width / height,
                0.1,
                1000,
            );

            const cameraPerspective = new THREE.PerspectiveCamera(90, 1 / 1, 1, 1000);
            const helper = new THREE.CameraHelper(cameraPerspective);
            scene.add(helper);

            const renderer = new THREE.WebGLRenderer({ canvas: context.canvas });

            const geometry = new THREE.PlaneGeometry(2.0, 2.0);
            material = new THREE.MeshBasicMaterial();
            const plane = new THREE.Mesh(geometry, material);

            // set canvas as material.map (this could be done to any map, bump, displacement etc.)
            if (pixelatingCanvasRef.current) {
                material.map = new THREE.CanvasTexture(pixelatingCanvasRef.current);
                material.map.magFilter = THREE.NearestFilter;
                material.map.minFilter = THREE.LinearMipMapLinearFilter;
                material.side = THREE.DoubleSide;
            }

            scene.add(plane);
            renderer.setSize(width, height);

            camera.position.z = 2.0;
            const animate = () => {
                plane.rotation.y -= 0.005;
                cameraPerspective.position.x = -Math.cos(plane.rotation.y + Math.PI / 2);
                cameraPerspective.position.z = Math.sin(plane.rotation.y + Math.PI / 2);
                cameraPerspective.lookAt(plane.position);
                cameraPerspective.updateProjectionMatrix();

                if (material.map) {
                    material.map.needsUpdate = true;
                }
                renderer.render(scene, camera);
                stats.update();
            };

            renderer.setAnimationLoop(animate);
        }
    }, [context]);

    const onRatioChange = (pixelatingCanvasContext: WebGL2RenderingContext) => {
        if (material) {
            material.map = new THREE.CanvasTexture(pixelatingCanvasContext.canvas);
            material.map.magFilter = THREE.NearestFilter;
            material.map.minFilter = THREE.LinearMipMapLinearFilter;
        }
    };

    //const windowDimensions = useWindowDimensions();
    return (
        <>
            <div ref={statsRef}></div>
            <Canvas className={/*`w-512 h-256 pixelated m-0.5 hidden`*/`hidden`}
                    width={16}
                    height={16}
                    ref={pixelatingCanvasRef}>
                {
                    context &&
                    <Pixelating
                        resolutions={[
                            { width: 16, height: 16 },
                            { width: 32, height: 32 },
                            { width: 64, height: 64 },
                            { width: 128, height: 128 },
                            { width: 256, height: 256 },
                            { width: 512, height: 512 },
                            { width: window.innerWidth, height: window.innerHeight },
                            //TODO { width: windowDimensions.width, height: windowDimensions.height },
                        ]}
                        onRatioChange={onRatioChange}
                        shaders={{ vert, frag, uniforms }}
                    />
                }
            </Canvas>

        </>
    );
};

export default Test;
