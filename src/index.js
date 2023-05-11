import { TextureSwitcher } from './modules/textureSwitcher';

const onload = function() {
    const canvas = document.querySelector('#mainCanvas');
    const button = document.querySelector('#button');
    const slider = document.querySelector('#slider');
    const scales = [
        { width: 32, height: 16 },
        { width: 64, height: 32 },
        { width: 128, height: 64 },
        { width: 256, height: 128 },
    ];

    canvas.width = scales[0].width;
    canvas.height = scales[0].height;
    const textureSwitcher = new TextureSwitcher(canvas, slider, button, scales);
};
window.onload = onload;