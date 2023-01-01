import {Container,Sprite, Texture, MeshMaterial, Geometry, Program, Mesh, BaseRenderTexture, RenderTexture, SCALE_MODES} from 'pixi.js';
import vert from '../shaders/shader.vert';
import frag from '../shaders/shader.frag';

function Tumbler({ parent, onChange }) {
    const textureButtonOff = Texture.from('off_tumbler');
    const textureButtonOn = Texture.from('on_tumbler');
    const button = new Sprite(textureButtonOff);
    button.position.set(600, 50);
    button.anchor.set(0.5);
    button.interactive = true;
    button.cursor = 'pointer';
    this.off = true;
    button.on('pointerup', () => {
        this.off = !this.off;
        onChange(this.off);
        if (this.off) {
            button.texture = textureButtonOff;
        } else {
            button.texture = textureButtonOn;
        }
    });
    parent.addChild(button);
}

export function TextureSwitcher({ parent, scales }) {

    this.scale = scales[0];
    this.container = new Container();
    parent.addChild(this.container);
    this.texturesData = Array(scales.length).fill(null).map((_, texturesDataIndex) => {
        /*let buff = new Uint8Array(width * height * 4);
        buff.forEach((_, bufferIndex) => {
            //RGBA
            [0, 0, 255, 255].forEach((colorChannel, colorChannelIndex) => {
                buff[bufferIndex * 4 + colorChannelIndex] = colorChannel;
            });
        });*/
        let width = 40 * scales[texturesDataIndex];
        let height = 20 * scales[texturesDataIndex];
        const texture = Texture.fromBuffer(/*buff*/null, width, height);

        const material = new MeshMaterial(texture, {
            program: Program.from(vert, frag),
            uniforms: {
                iTime: 0,
                iMouse: [0, 0],
                iScale: scales[texturesDataIndex],
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
        let mesh = new Mesh(geometry, material);
        const brt = new BaseRenderTexture(width, height, SCALE_MODES.NEAREST);
        let renderTexture = new RenderTexture(brt);

        let sprite = new Sprite(renderTexture);
        sprite.anchor.set(0.5, 0.5);
        sprite.position.set(400, 300);
        sprite.scale.set(20 / scales[texturesDataIndex], 20 / scales[texturesDataIndex]);
        sprite.interactive = true;
        sprite.buttonMode = true;
        mesh.mouse = {
            x: 0,
            y: 0,
        };
        sprite.visible = (texturesDataIndex === 1);
        sprite.on('pointertap', function(event) {
            console.log('PointerTap event');
            mesh.mouse.x = event.global.x;
            mesh.mouse.y = event.global.y;
            console.log('X', mesh.mouse.x, 'Y', mesh.mouse.y);
        });
        this.container.addChild(sprite);
        return { sprite, mesh, renderTexture };
    });

    this.mesh = this.texturesData[1].mesh;
    this.renderTexture = this.texturesData[1].renderTexture;

    this.tumbler = new Tumbler({
        parent,
        onChange: (off) => {
            this.scale = off ? scales[1] : scales[0];
            this.texturesData.forEach(({ sprite }) => {
                sprite.visible = !sprite.visible;
            });
            this.mesh = this.texturesData[off ? 1 : 0].mesh;
            this.renderTexture = this.texturesData[off ? 1 : 0].renderTexture;
            console.log(off);
        },
    });
}

TextureSwitcher.prototype.update = function(app) {
    this.mesh.shader.uniforms.iTime = app.ticker.lastTime / 500;
    this.mesh.shader.uniforms.iMouse = [this.mesh.mouse.x, this.mesh.mouse.y];
    app.renderer.render(this.mesh, { renderTexture: this.renderTexture });

};