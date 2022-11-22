import * as PIXI from 'pixi.js';
import { Application } from '@pixi/app';
import { InteractionManager } from '@pixi/interaction';
import { frag } from './shaders/fragment';
import { vert } from './shaders/vertex';
const init = () => {
    const app = new Application({
        width: 800,
        height: 600,
        backgroundColor: 0xFFE1B5,
        antialias: true,
    });
    app.renderer.plugins.interaction = new InteractionManager(app.stage, app.view);

    let container = new PIXI.Container();
    app.stage.addChild(container);

    const style = new PIXI.TextStyle({
        fontSize: 20,
        fontFamily: 'Arial, Helvetica, sans-serif',
    });
    const text = new PIXI.Text('Low Pixels Ray Tracing', style);
    container.addChild(text);

    let width=40;
    let height=20;
    /*let buff = new Uint8Array(width * height * 4);
    buff.forEach((_, bufferIndex) => {
        //RGBA
        [0, 0, 255, 255].forEach((colorChannel, colorChannelIndex) => {
            buff[bufferIndex * 4 + colorChannelIndex] = colorChannel;
        });
    });*/

    const texture = PIXI.Texture.fromBuffer(/*buff*/null, width, height);
    const material = new PIXI.MeshMaterial(texture, {
        program: PIXI.Program.from(vert, frag),
        uniforms: {
            iTime: 0,
            iMouse: [0, 0],
        }
    });
    const geometry = new PIXI.Geometry()
        .addAttribute('aVertexPosition',
            [
                0, 0,
                width, 0,
                width, height,
                0, height,
            ], 2)
        .addAttribute('aUvs',
            [
                0, 0,
                width/height, 0,
                width/height, 1,
                0, 1,
            ],2)
        .addIndex([0, 1, 2, 0, 2, 3]);

    const mesh = new PIXI.Mesh(geometry, material);
    const renderTexture = new PIXI.RenderTexture.create({ width, height, scaleMode: PIXI.SCALE_MODES.NEAREST });
    let sprite = new PIXI.Sprite(renderTexture);
    sprite.anchor.set(0.5, 0.5);
    sprite.position.set(400, 300);
    sprite.scale.set(10, 10);
    let mouse = {
        x: 0,
        y: 0,
    };
    sprite.interactive = true;
    sprite.buttonMode = true;
    sprite.on('pointertap', function(event) {
        console.log('PointerTap event');
        let localPosition = event.data.getLocalPosition(event.currentTarget)
        mouse.x = localPosition.x+20;
        mouse.y = localPosition.y+10;
        console.log('X', mouse.x, 'Y', mouse.y);
    });
    container.addChild(sprite);
    app.ticker.add(() => {
        mesh.shader.uniforms.iTime = app.ticker.lastTime / 1000;
        mesh.shader.uniforms.iMouse = [mouse.x, mouse.y];
        app.renderer.render(mesh, { renderTexture });
    });
    app.ticker.start();

    document.body.querySelector('#root').appendChild(app.view);

};
window.onload = init;