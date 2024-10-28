'use client'
import React, { useEffect, useState } from 'react';
import Canvas from '@/components/Canvas';
import Pixelating from '@/components/Pixelating/Pixelating';
import vert from '@/components/Scenes/Test/shaders/vert.glsl';
import frag from '@/components/Scenes/Test/shaders/frag.glsl';
import uniforms from '@/components/Scenes/Test/uniforms';
import Link from 'next/link';
//import { useWindowDimensions } from '@/hooks/useWindowDimensions';

const DesktopPage = () => {
    const mobile = false;
    const [isMounted, setIsMounted] = useState(false);
    //const windowDimensions = useWindowDimensions();
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
                            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                <span className="block clear-both">{mobile ? 'Мобильная' : 'Десктопная'}</span>{' '}
                                <span className={`block text-primary`}>{'версия'}</span>
                            </h1>

                            <div className={`flex items-center flex-col`}>
                                <Canvas className={`w-512 h-512 pixelated`} width={512} height={512}>
                                    {
                                        isMounted && <Pixelating
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
                                            onRatioChange={() => {}}
                                            shaders={{ vert, frag, uniforms }}
                                        />
                                    }
                                </Canvas>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};
export default DesktopPage;
