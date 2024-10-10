'use client';
import React from 'react';
import About from '@/components/About';
const MobilePage = () => {
    const mobile = true;
    return (
        <div className={`bg-background grid gap-y-16 overflow-hidden`}>
            <About />
        </div>
    );
};
export default MobilePage;
