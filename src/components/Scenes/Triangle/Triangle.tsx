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

const Triangle = () => {
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
            const width = context.canvas.width;
            const height = context.canvas.height;
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
            // set canvas as material.map (this could be done to any map, bump, displacement etc.)
            if (pixelatingCanvasRef.current) {
                material.map = new THREE.CanvasTexture(pixelatingCanvasRef.current);
                material.map.magFilter = THREE.NearestFilter;
                material.map.minFilter = THREE.LinearMipMapLinearFilter;
                material.side = THREE.DoubleSide;
                material.transparent = true;
                material.opacity = 0.2;
            }

            const plane = new THREE.Mesh(geometry, material);

            const triangleGeometry = new THREE.BufferGeometry();
            const uniformTrianglesData = uniforms.find((uniform) => {
                return uniform.name === 'trianglesPoints';
            })!.data;
            const vertices = new Float32Array(uniformTrianglesData);
            const indices = [
                0, 1, 2,
            ];
            triangleGeometry.setIndex(indices);
            triangleGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
            const triangleMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);

            scene.add(plane);
            scene.add(triangleMesh);

            renderer.setSize(width, height);

            camera.position.z = 2.0;
            //plane.rotation.y = Math.PI/4;

            const pointer = new THREE.Vector2(-999, -999);
            const raycaster = new THREE.Raycaster();
            const rect = (context.canvas as HTMLCanvasElement).getBoundingClientRect();

            const mouseMove = (event: MouseEvent) => {
                // calculate pointer position in normalized device coordinates
                // (-1 to +1) for both components
                pointer.x = ((event.clientX - rect.left) / context.canvas.width) * 2 - 1;
                pointer.y = -((event.clientY - rect.top) / context.canvas.height) * 2 + 1;
            };
            (context.canvas as HTMLCanvasElement).addEventListener('mousemove', mouseMove);
            const animate = () => {
                plane.rotation.y -= 0.005;

                raycaster.setFromCamera(pointer, camera);
                // calculate objects intersecting the picking ray
                const intersects = raycaster.intersectObjects([plane], false);
                if (intersects.length > 0) {
                    plane.material.color.set(0xff0000);
                } else {
                    plane.material.color.set(0xffffff);
                }

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

export default Triangle;
