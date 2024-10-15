'use client'
import React from 'react';
import Canvas from "@/components/Canvas";
import Triangle from "@/components/Scenes/Triangle/Triangle";
const DesktopPage = () => {
  return (
      <div className={`bg-background grid gap-y-0 overflow-hidden`}>
        <div className={`relative bg-background flex items-center flex-col`}>
          <div className={`max-w-7xl mx-auto`}>
            <main className={`mx-auto max-w-7xl`}>
              <div className={`sm:text-left lg:text-left`}>
                <div className={`flex items-center flex-col`}>
                  <Canvas className={`w-4/5 h-4/5 pixelated`} width={512} height={512}>
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
