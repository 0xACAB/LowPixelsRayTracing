'use client';
import React from 'react';
import About from '@/components/About';
const DesktopPage = () => {
    const mobile = false;
    return (
        <div className={`bg-background grid gap-y-0 overflow-hidden`}>
            <About />
        </div>
    );
};
export default DesktopPage;
