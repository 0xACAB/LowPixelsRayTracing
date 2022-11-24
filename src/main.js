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


    const Telegram_2019_Logo = new PIXI.Sprite(PIXI.Texture.from('Telegram_2019_Logo.svg'));
    Telegram_2019_Logo.position.set(40,50);
    Telegram_2019_Logo.anchor.set(0.5);
    Telegram_2019_Logo.scale.set(0.33);

    const style = new PIXI.TextStyle({
        fontSize: 20,
        fontFamily: 'Arial, Helvetica, sans-serif',
    });
    const text = new PIXI.Text('@xTrancendence', style);
    text.position.set(75,50);
    text.anchor.set(0, 0.5);
    text.interactive = true;
    text.buttonMode = true;
    text.on('pointertap', function(event) {
        window.open('https://t.me/xTranscendence', "__blank")
    });
    container.addChild(text);
    container.addChild(Telegram_2019_Logo);
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
    sprite.scale.set(20, 20);
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
        mesh.shader.uniforms.iTime = app.ticker.lastTime / 100;
        mesh.shader.uniforms.iMouse = [mouse.x, mouse.y];
        app.renderer.render(mesh, { renderTexture });
    });
    app.ticker.start();

    document.body.querySelector('#app').appendChild(app.view);

};
window.onload = init;