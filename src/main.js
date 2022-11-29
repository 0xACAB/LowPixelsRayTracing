import * as PIXI from 'pixi.js';
import { Application } from '@pixi/app';
import { InteractionManager } from '@pixi/interaction';
import {Tumbler} from './widgets/tumbler'
/*import { frag } from './shaders/fragment';
import { vert } from './shaders/vertex';*/
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
    container.addChild(Telegram_2019_Logo);


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
    /*let buff = new Uint8Array(width * height * 4);
    buff.forEach((_, bufferIndex) => {
        //RGBA
        [0, 0, 255, 255].forEach((colorChannel, colorChannelIndex) => {
            buff[bufferIndex * 4 + colorChannelIndex] = colorChannel;
        });
    });*/

    //renderTexture.resize(width/2,height,true);
    let tumbler = new Tumbler({
        parent: container,
        scale: 20,
        onChange: (stateText) => {
            console.log(stateText)
        }
    });
    app.ticker.add(() => {
        tumbler.mesh.shader.uniforms.iTime = app.ticker.lastTime / 300;
        tumbler.mesh.shader.uniforms.iMouse = [tumbler.mouse.x, tumbler.mouse.y];
        app.renderer.render(tumbler.mesh, { renderTexture:tumbler.renderTexture });
    });
    app.ticker.start();

    document.body.querySelector('#app').appendChild(app.view);

};
window.onload = init;