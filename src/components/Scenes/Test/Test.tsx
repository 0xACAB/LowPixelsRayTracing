'use client';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';

import vert from './shaders/vert.glsl';
import frag from './shaders/frag.glsl';
import uniforms from './uniforms';
import { Pixelating, IPixelating } from '@/components/Pixelating/Pixelating';
import Slider from '@/components/Pixelating/Slider';

const Test = () => {
    const statsRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pixelatingCanvasRef = useRef<HTMLCanvasElement>(null);
    const resolutions = [
        { width: 16, height: 16 },
        { width: 32, height: 32 },
        { width: 64, height: 64 },
        { width: 128, height: 128 },
        { width: 256, height: 256 },
        { width: 512, height: 512 },
    ];
    let currentResolutionIndex = 1;

    let material: THREE.MeshBasicMaterial;
    let pixelating: IPixelating | undefined;
    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ canvas });
            const stats = new Stats();
            if (statsRef.current) {
                statsRef.current.appendChild(stats.dom);
            }

            const scene = new THREE.Scene();
            const width = canvas.width;
            const height = canvas.height;
            const camera = new THREE.PerspectiveCamera(
                90,
                width / height,
                0.1,
                1000,
            );
            //aspect ratio should be 1:1 now
            const cameraPerspective = new THREE.PerspectiveCamera(90, width / height, 1, 1000);
            const helper = new THREE.CameraHelper(cameraPerspective);

            const geometry = new THREE.PlaneGeometry(2.0, 2.0);
            material = new THREE.MeshBasicMaterial();
            // set canvas as material.map (this could be done to any map, bump, displacement etc.)
            if (pixelatingCanvasRef.current) {
                const context = pixelatingCanvasRef.current.getContext('webgl2');
                pixelating = Pixelating({
                    context,
                    shaders: { vert, frag, uniforms },
                    resolutions,
                    defaultResolution: currentResolutionIndex,
                });

                material.map = new THREE.CanvasTexture(pixelatingCanvasRef.current);
                material.map.magFilter = THREE.NearestFilter;
                material.side = THREE.DoubleSide;
                material.transparent = true;
                material.opacity = 0.4;
            }

            const plane = new THREE.Mesh(geometry, material);

            /*const lineMaterial = new THREE.LineBasicMaterial({ color: 0xFFD400 });
            const lineGeometry = new THREE.BufferGeometry();
            const line = new THREE.Line(lineGeometry, lineMaterial);*/

            const lineMaterial2 = new THREE.LineBasicMaterial({ color: 0x00FF00 });
            const lineGeometry2 = new THREE.BufferGeometry();
            const line2 = new THREE.Line(lineGeometry2, lineMaterial2);

            /*const pointsL1: Array<THREE.Vector3> = [
                new THREE.Vector3(0, 0, 1),
            ];*/
            const pointsL2: Array<THREE.Vector3> = [
                new THREE.Vector3(0, 0, 1),
            ];

            const group = new THREE.Group();
            group.add(plane);
            //group.add(line);
            group.add(line2);

            scene.add(helper);
            scene.add(group);

            renderer.setSize(width, height);

            const pointer = new THREE.Vector2(-999, -999);
            const rayCaster = new THREE.Raycaster();

            const pointerDown = (event: MouseEvent) => {
                // calculate pointer position in normalized device coordinates
                // (-1 to +1) for both components
                const rect = canvas.getBoundingClientRect();
                pointer.x = ((event.clientX - rect.left) / canvas.width) * 2 - 1;
                pointer.y = -((event.clientY - rect.top) / canvas.height) * 2 + 1;
                rayCaster.setFromCamera(pointer, camera);
                // calculate objects intersecting the picking ray
                const intersects = rayCaster.intersectObjects([plane], false);
                const uv = intersects[0]?.uv;
                if (uv) {
                    const { width, height } = resolutions[currentResolutionIndex];
                    uniforms.iMouse.data = [
                        Math.floor((uv.x - 0.5) * width),
                        Math.floor((uv.y - 0.5) * height),
                    ];
                    /*pointsL1[1] = new THREE.Vector3(
                        (uv.x - 0.5) * plane.geometry.parameters.width,
                        (uv.y - 0.5) * plane.geometry.parameters.height,
                        0,
                    );*/
                    const xFloored = Math.floor((uv.x - 0.5) * width) / width;
                    const yFloored = Math.floor((uv.y - 0.5) * height) / height;
                    const xHalfPixel = 1 / width * 0.5;
                    const yHalfPixel = 1 / height * 0.5;

                    pointsL2[1] = new THREE.Vector3(
                        3 * (xFloored + xHalfPixel) * plane.geometry.parameters.width,
                        3 * (yFloored + yHalfPixel) * plane.geometry.parameters.height,
                        -2,
                    );
                    //lineGeometry.setFromPoints(pointsL1);
                    lineGeometry2.setFromPoints(pointsL2);
                }

            };
            canvas.addEventListener('pointerdown', pointerDown);

            camera.position.z = 2.0;
            //group.rotation.y = Math.PI/4;
            const animate = (time: number) => {
                //convert to seconds
                time *= 0.001;
                group.rotation.y -= 0.005;
                cameraPerspective.position.x = -Math.cos(group.rotation.y + Math.PI / 2);
                cameraPerspective.position.z = Math.sin(group.rotation.y + Math.PI / 2);
                cameraPerspective.lookAt(plane.position);
                cameraPerspective.updateProjectionMatrix();

                if (pixelating && material.map) {
                    material.map.needsUpdate = true;
                    pixelating.render(time);
                }
                renderer.render(scene, camera);
                stats.update();
            };
            renderer.setAnimationLoop(animate);
            // Cleanup function to dispose of WebGL resources
            return () => {
                // Stop the animation loop
                renderer.setAnimationLoop(null);
            };
        }
    }, []);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (material && pixelating) {
            currentResolutionIndex = event.target.valueAsNumber;
            material.map = new THREE.CanvasTexture(pixelating.context.canvas);
            material.map.magFilter = THREE.NearestFilter;
            uniforms.iMouse.data = [-999, -999];

            pixelating.onChange(event);
        }
    };
    return (
        <>
            <div ref={statsRef}></div>
            <canvas id="canvas" className={`pixelated`} width={512} height={512} ref={canvasRef}></canvas>
            <canvas id="canvas" className={`hidden`} ref={pixelatingCanvasRef}></canvas>
            <Slider onChange={onChange} resolutions={resolutions} defaultResolution={currentResolutionIndex} />
        </>
    );
};

export default Test;