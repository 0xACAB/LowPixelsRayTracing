'use client';
import React, { useEffect, useRef, useState } from 'react';
import Canvas from '@/components/Canvas';
import Pixelating from '@/components/Pixelating/Pixelating';
import vert from '@/components/Scenes/Test/shaders/vert.glsl';
import frag from '@/components/Scenes/Test/shaders/frag.glsl';
import uniforms from '@/components/Scenes/Test/uniforms';
import Link from 'next/link';

const DesktopPage = () => {
    const pixelatingCanvasRef = useRef<HTMLCanvasElement>(null);
    const [isMounted, setIsMounted] = useState(false);

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
        setIsMounted(true);
    });
    return (
        <div className={`bg-background grid gap-y-0 overflow-hidden`}>
            <div className={`flex items-center flex-col`}><Link href="/">Назад к меню</Link></div>
            <div className={`relative bg-background flex items-center flex-col`}>
                <div className="max-w-7xl mx-auto">
                    <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-16 lg:px-8 xl:mt-16">
                        <div className="sm:text-left lg:text-left">
                            <div className={`flex items-center flex-col`}>
                                <canvas id="canvas"
                                        className={`w-512 h-512 pixelated`}
                                        width={512}
                                        height={512}
                                        ref={pixelatingCanvasRef}
                                ></canvas>
                                {
                                    isMounted && <Pixelating
                                        canvasRef={pixelatingCanvasRef}
                                        resolutions={resolutions}
                                        defaultResolution={currentResolutionIndex}
                                        onRatioChange={() => {}}
                                        shaders={{ vert, frag, uniforms }}
                                    />
                                }
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};
export default DesktopPage;
