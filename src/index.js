import { TextureSwitcher2 } from './widgets/textureSwitcher';

const onload = function() {
    const canvas = document.querySelector('#mainCanvas');
    const textureSwitcher2 = new TextureSwitcher2(
        canvas,
        [
            { width: canvas.width, height: canvas.height},
            { width: 800, height: 400 }
        ]);
};
window.onload = onload;