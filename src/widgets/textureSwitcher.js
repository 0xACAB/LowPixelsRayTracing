let core = require('@pixi/core');
core.generateProgram = (gl, program)=>{
    console.log('Перехватил');
    debugger
}
core.ShaderSystem.prototype.generateProgram =  (shader)=>{
    console.log('Перехватил');
    debugger
}
import {
    Container,
    Sprite,
    Texture,
    MeshMaterial,
    Geometry,
    Program,
    Mesh,
    BaseRenderTexture,
    RenderTexture,
    SCALE_MODES,
} from 'pixi.js';

import {modelShaderString} from '../shaders/model'
import vert from '../shaders/shader.vert';

//Подгружаю шейдеры
//Склеиваю шейдеры в один для передачи в PIXI.Program
//В конце каждого из файлов шейдеров надо переводить каретку
import uniforms from '../shaders/uniforms.frag';
import shader from '../shaders/shader.frag';
const frag = uniforms+modelShaderString+shader;

/**
 *
 * @param container - контейнер для компонента
 * @param onChange - коллбек который должен быть выполнен при щелчке тумблера
 * @param startState - стартовое состояние тумблера (1 - вкл. / 0 - выкл.)
 * @constructor
 */
function Tumbler({ container, onChange, startState }) {
    const textureButtonOff = Texture.from('off_tumbler');
    const textureButtonOn = Texture.from('on_tumbler');
    const button = new Sprite(startState ? textureButtonOn : textureButtonOff);
    button.position.set(600, 50);
    button.anchor.set(0.5);
    button.interactive = true;
    button.cursor = 'pointer';
    this.state = startState;
    button.on('pointerup', () => {
        this.state = this.state ? 0 : 1;
        onChange(this.state);

        if (this.state) {
            button.texture = textureButtonOn;
        } else {
            button.texture = textureButtonOff;
        }
    });
    container.addChild(button);
    onChange(startState);
}

/**
 *
 * @param container - контейнер для компонента
 * @param scales
 * @constructor
 */
export function TextureSwitcher({ container, scales }) {
    this.container = new Container();
    container.addChild(this.container);
    const maxResolutionIndex = 1;
    //Единицу можно просто закомментить и тогда не будут тратиться ресурсы на создание 2 тектуры
    this.texturesData = [0/*, 1*/].map((_, texturesDataIndex) => {
        /*let buff = new Uint8Array(width * height * 4);
        buff.forEach((_, bufferIndex) => {
            //RGBA
            [0, 0, 255, 255].forEach((colorChannel, colorChannelIndex) => {
                buff[bufferIndex * 4 + colorChannelIndex] = colorChannel;
            });
        });*/
        const width = scales[texturesDataIndex].width;
        const height = scales[texturesDataIndex].height;
        const texture = Texture.fromBuffer(/*buff*/null, width, height);
        const ratio = width / height;
        const material = new MeshMaterial(texture, {
            program: Program.from(vert, frag),
            uniforms: {
                iTime: 0,
                iMouse: [0, 0],
                iScaleWidth: scales[texturesDataIndex].width / ratio,
                iScaleHeight: scales[texturesDataIndex].height,
                meshPoints: [
                    /*2.5, 2.5, 50.0,
                    2.5, 2.5, 30.0,
                    2.5, -2.5, 30.0,
                    2.5, -2.5, 50.0,
                    -2.5, 2.5, 50.0,
                    -2.5, -2.5, 50.0,
                    -2.5, 2.5, 30.0,
                    -2.5, -2.5, 30.0,*/

                    -0.152493, 9.028288, -0.148813,
                    -0.249486, 8.948933, -0.243465,
                    -0.002603, 9.028288, -0.213056,
                    -0.004259, 8.948933, -0.348570,
                    0.148812, 9.028288, -0.152494,
                    0.243464, 8.948933, -0.249488,
                    0.213055, 9.028288, -0.002604,
                    0.348568, 8.948933, -0.004260,
                    0.213055, 9.302430, -0.002605,
                    0.152493, 9.028288, 0.148811,
                    0.249486, 8.948933, 0.243463,
                    0.002603, 9.028288, 0.213053,
                    0.004259, 8.948933, 0.348567,
                    -0.148812, 9.028288, 0.152492,
                    -0.243464, 8.948933, 0.249485,
                    -0.213054, 9.028288, 0.002602,
                    -0.348568, 8.948933, 0.004258,
                    -0.011110, 7.466897, -0.909412,
                    0.627217, 7.466897, -0.654099,
                    0.898049, 7.466897, -0.022200,
                    0.642736, 7.466897, 0.616127,
                    0.010837, 7.466897, 0.886959,
                    -0.627490, 7.466897, 0.631646,
                    -0.898322, 7.466897, -0.000252,
                    -0.643009, 7.466897, -0.638580,
                    -0.014489, 8.583366, -1.185936,
                    -0.848827, 8.583366, -0.828338,
                    0.828338, 8.583366, -0.848829,
                    1.185936, 8.583366, -0.014490,
                    0.848829, 8.583366, 0.828336,
                    0.014490, 8.583366, 1.185934,
                    -0.828336, 8.583366, 0.848827,
                    -1.185934, 8.583366, 0.014488,
                    -0.014489, 8.583366, -1.185936,
                    -0.848827, 8.583366, -0.828338,
                    0.828338, 8.583366, -0.848829,
                    1.185936, 8.583366, -0.014490,
                    0.848829, 8.583366, 0.828336,
                    0.014490, 8.583366, 1.185934,
                    -0.828336, 8.583366, 0.848827,
                    -1.185934, 8.583366, 0.014488,
                    0.002678, 8.875105, 0.219200,
                    -0.153105, 8.875105, 0.156892,
                    0.156893, 8.875105, 0.153104,
                    -0.219201, 8.875105, 0.002677,
                    0.219202, 8.875105, -0.002679,
                    -0.156893, 8.875105, -0.153106,
                    0.153105, 8.875105, -0.156894,
                    -0.002678, 8.875105, -0.219203,
                    -0.002603, 9.850716, -0.213057,
                    -0.152493, 9.850716, -0.148814,
                    0.148812, 9.850716, -0.152495,
                    0.213055, 9.850716, -0.002605,
                    0.000000, 9.975286, -0.000002,
                    0.152493, 9.850716, 0.148810,
                    0.002603, 9.850716, 0.213053,
                    -0.148812, 9.850716, 0.152491,
                    -0.213054, 9.850716, 0.002601,
                    0.213055, 9.576573, -0.002605,
                    -0.213054, 9.302430, 0.002601,
                    -0.213054, 9.576573, 0.002601,
                    0.148812, 9.576572, -0.152495,
                    0.148812, 9.302430, -0.152495,
                    -0.148812, 9.576572, 0.152491,
                    -0.148812, 9.302430, 0.152491,
                    -0.002603, 9.576572, -0.213057,
                    -0.002603, 9.302430, -0.213057,
                    -0.152493, 9.302430, -0.148814,
                    -0.152493, 9.576573, -0.148814,
                    0.002603, 9.576572, 0.213052,
                    0.002603, 9.302430, 0.213052,
                    0.152493, 9.302430, 0.148810,
                    0.152493, 9.576573, 0.148810,
                    0.213055, 9.302430, -0.002605,
                    0.213055, 9.576573, -0.002605,
                    -0.213054, 9.302430, 0.002601,
                    -0.213054, 9.576573, 0.002601,
                    0.148812, 9.576572, -0.152495,
                    0.148812, 9.302430, -0.152495,
                    -0.148812, 9.576572, 0.152491,
                    -0.148812, 9.302430, 0.152491,
                    0.419512, 9.153886, -0.091092,
                    0.419512, 9.725119, -0.091093,
                    -0.419512, 9.153886, 0.091090,
                    -0.419512, 9.725119, 0.091089,
                    0.355269, 9.725118, -0.240983,
                    0.355269, 9.153884, -0.240982,
                    -0.355269, 9.725118, 0.240979,
                    -0.355269, 9.153884, 0.240980,
                ].map((pointData, index)=>{
                    if (index%3===0) return pointData
                    if (index%3===1){
                        return -1*(pointData-11)
                    }
                    if (index%3===2){
                        return 30;
                    }
                })
            },
        });
        const geometry = new Geometry()
            .addAttribute('aVertexPosition',
                [
                    0, 0,
                    width, 0,
                    width, height,
                    0, height,
                ], 2)
            .addAttribute('aUvs',
                [
                    0-1, 0,
                    ratio-1, 0,
                    ratio-1, 1,
                    0-1, 1,
                ], 2)
            .addIndex([0, 1, 2, 0, 2, 3]);
        const mesh = new Mesh(geometry, material);
        const brt = new BaseRenderTexture(width, height, SCALE_MODES.NEAREST);
        const renderTexture = new RenderTexture(brt);

        const sprite = new Sprite(renderTexture);
        sprite.position.set(0, 100);
        const spriteScale = {
            x: scales[maxResolutionIndex].width / scales[texturesDataIndex].width,
            y: scales[maxResolutionIndex].height / scales[texturesDataIndex].height,
        };
        sprite.scale.set(spriteScale.x, spriteScale.y);
        sprite.interactive = true;
        mesh.mouse = {
            x: 0,
            y: 0,
        };
        sprite.on('pointertap', function(event) {
            console.log('PointerTap event');
            mesh.mouse.x = (event.global.x - event.target.position.x-event.target.width/2) / spriteScale.x;
            mesh.mouse.y = (event.global.y - event.target.position.y) / spriteScale.y;

            console.log('X', mesh.mouse.x, 'Y', mesh.mouse.y);
        });
        this.container.addChild(sprite);
        return { sprite, mesh, renderTexture };
    });

    new Tumbler({
        container,
        onChange: (state) => {
            this.texturesData.forEach(({ sprite }, textureDataIndex) => {
                sprite.visible = (textureDataIndex === state);
            });
            this.mesh = this.texturesData[state].mesh;
            this.renderTexture = this.texturesData[state].renderTexture;
            /*TODO*/
            if (state===0){
                this.app&&this.app.renderer.render(this.mesh, { renderTexture: this.renderTexture });
            }
        },
        startState: 0,
    });
}
TextureSwitcher.prototype.update = function(app) {
    this.mesh.shader.uniforms.iTime = app.ticker.lastTime / 500;
    this.mesh.shader.uniforms.iMouse = [this.mesh.mouse.x, this.mesh.mouse.y];
    //app.renderer.render(this.mesh, { renderTexture: this.renderTexture });
};