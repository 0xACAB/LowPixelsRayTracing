import React from 'react';

export const metadata = {
    title: 'Landing for raytracing',
    description: 'Generated by Next.js',
};

export default async function MathLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body>
        {children}
        </body>
        </html>
    );
}
