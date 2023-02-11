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
import vert from '../shaders/shader.vert';
import frag from '../shaders/shader.frag';

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
    this.texturesData = [0, 1].map((_, texturesDataIndex) => {
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
                meshPoints:[
                    5.0+1.0, 2.5+3.5, 50.0,
                    0.0+1.0, 2.5+3.5, 50.0,
                    0.0+1.0, -2.5+3.5, 50.0,
                    5.0+1.0, -2.5+3.5, 50.0,

                    /*0.105323, -0.354834, -0.073347,
                    0.111377, -0.248803, 0.002512,
                    0.082688, -0.251621, 0.012655,

                    0.039806, -0.344149, 0.022447,
                    0.067045, -0.339329, 0.015606,
                    0.066835, -0.255360, 0.033308,

                    0.028103, -0.266495, 0.045690,
                    0.044970, -0.418859, -0.022001,
                    0.065286, -0.415543, -0.026058,

                    -0.019112, -0.440346, 0.023551,
                    0.001000, -0.439791, 0.020621,
                    0.004008, -0.348000, 0.046143,

                    -0.027999, -0.351921, 0.050459,
                    0.005042, -0.271158, 0.053398,
                    -0.039202, -0.274230, 0.059800*/
                ],
                meshTrianglesData: [
                    0, 1, 2,
                    3, 0, 2
                    /*6, 7, 8,
                    9, 10, 11,
                    12, 13, 14,
                    15, 16, 17*/
                ],
                meshTrianglesColors: [
                    1.0, 0.0, 0.0,
                    0.0, 0.0, 1.0
                ]
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
                    0, 0,
                    ratio, 0,
                    ratio, 1,
                    0, 1,
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
            mesh.mouse.x = (event.global.x - event.target.position.x) / spriteScale.x;
            mesh.mouse.y = (event.global.y - event.target.position.y) / spriteScale.y;

            console.log('X', mesh.mouse.x, 'Y', mesh.mouse.y);
        });
        this.container.addChild(sprite);
        return { sprite, mesh, renderTexture };
    });

    this.tumbler = new Tumbler({
        container,
        onChange: (state) => {
            this.texturesData.forEach(({ sprite }, textureDataIndex) => {
                sprite.visible = (textureDataIndex === state);
            });
            this.mesh = this.texturesData[state].mesh;
            this.renderTexture = this.texturesData[state].renderTexture;
        },
        startState: 0,
    });
}

TextureSwitcher.prototype.update = function(app) {
    this.mesh.shader.uniforms.iTime = app.ticker.lastTime / 500;
    this.mesh.shader.uniforms.iMouse = [this.mesh.mouse.x, this.mesh.mouse.y];
    app.renderer.render(this.mesh, { renderTexture: this.renderTexture });
};