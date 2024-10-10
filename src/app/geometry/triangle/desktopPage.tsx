'use client'
import React, { useEffect, useRef } from 'react';
import Canvas from "@/components/Canvas";
import Triangle from "@/components/Scenes/Triangle/Triangle";
const DesktopPage = () => {
  return (
      <div className={`bg-background grid gap-y-0 overflow-hidden`}>
        <div className={`relative bg-background flex items-center flex-col`}>
          <div className={`max-w-7xl mx-auto`}>
            <main className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`}>
              <div className={`sm:text-left lg:text-left`}>
                <div className={`flex items-center flex-col`}>
                  <Canvas className={`w-full h-4/5 pixelated`} width={512} height={256}>
                    <Triangle/>
                  </Canvas>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
  );
};
export default DesktopPage
