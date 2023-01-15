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

        const material = new MeshMaterial(texture, {
            program: Program.from(vert, frag),
            uniforms: {
                iTime: 0,
                iMouse: [0, 0],
                iScaleWidth: scales[texturesDataIndex].width,
                iScaleHeight: scales[texturesDataIndex].height,
                trianglePoints: [
                    1.0, 2.5, 3.0,
                    2.0, 2.5, 3.0,
                    3.5, 2.5, 4.0
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
                    width / height, 0,
                    width / height, 1,
                    0, 1,
                ], 2)
            .addIndex([0, 1, 2, 0, 2, 3]);
        const mesh = new Mesh(geometry, material);
        const brt = new BaseRenderTexture(width, height, SCALE_MODES.NEAREST);
        const renderTexture = new RenderTexture(brt);

        const sprite = new Sprite(renderTexture);
        sprite.anchor.set(0.5, 0.5);
        sprite.position.set(400, 300);
        sprite.scale.set(800 / scales[texturesDataIndex].width, 400 / scales[texturesDataIndex].height);
        sprite.interactive = true;
        sprite.buttonMode = true;
        mesh.mouse = {
            x: 0,
            y: 0,
        };
        sprite.on('pointertap', function(event) {
            console.log('PointerTap event');
            mesh.mouse.x = event.global.x;
            mesh.mouse.y = event.global.y;

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