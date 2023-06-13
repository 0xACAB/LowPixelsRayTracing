import { TextureSwitcher } from './modules/textureSwitcher';

const onload = function() {
    const canvas = document.querySelector('#mainCanvas');
    const slider = document.querySelector('#slider');
    const list = document.querySelector('#values');
    const scales = [
        { width: 64, height: 32 },
        { width: 128, height: 64 },
        { width: 256, height: 128 },
        { width: 512, height: 256 },
        { width: 1024, height: 512 },
    ];
    scales.forEach(({ width,height }, optionIndex)=>{
        const option = document.createElement('option');
        option.value = optionIndex+'';
        option.label = width+'x'+height;
        list.appendChild(option);
    })
    canvas.width = scales[0].width;
    canvas.height = scales[0].height;
    const textureSwitcher = new TextureSwitcher(canvas, slider, scales);
};
window.onload = onload;