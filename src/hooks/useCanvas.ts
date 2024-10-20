import { createContext, useContext } from 'react';

export const CanvasContext = createContext<{
    context: WebGL2RenderingContext | undefined;
}>({
    context: undefined,
});

export const useCanvasContext = () => {
    return useContext(CanvasContext);
};
