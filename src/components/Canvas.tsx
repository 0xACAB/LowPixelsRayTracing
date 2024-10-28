'use client'
import React, { useEffect, ReactNode, useState, useRef, forwardRef, ForwardedRef } from 'react';

import { CanvasContext } from '@/hooks/useCanvas';

interface CanvasProps {
    children: ReactNode,
    className: string,
    width: number,
    height: number
}

/**
 * Second parameter type should be ForwardedRef<HTMLCanvasElement>, but second parameter in FunctionComponent is
 * deprecated (deprecatedLegacyContext?: any).
 */
const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
    (
        {
            children,
            className,
            width,
            height,
        },
        ref: ForwardedRef<HTMLCanvasElement> | any,
    ) => {
        if (!ref) {
            ref = useRef<HTMLCanvasElement>(null);
        }
        const [
            context,
            setContext,
        ] = useState<WebGL2RenderingContext | undefined>();

        useEffect(() => {
            const context = ref?.current?.getContext('webgl2');
            if (context) {
                setContext(context);
            }
        }, []);
        return (
            <CanvasContext.Provider value={{ context }}>
                <canvas id="canvas" className={className} width={width} height={height} ref={ref}></canvas>
                {children}
            </CanvasContext.Provider>
        );

    });
export default Canvas;