import { TextureSwitcher } from './modules/textureSwitcher';

const onload = function() {
    const canvas = document.querySelector('#mainCanvas');
    const button = document.querySelector('#button');
    const textureSwitcher = new TextureSwitcher(
        canvas,
        button,
        [
            { width: canvas.width, height: canvas.height},
            { width: 800, height: 400 }
        ]);
};
window.onload = onload;