import * as PIXI from 'pixi.js';
import { vert } from '../shaders/vertex';
import { frag } from '../shaders/fragment';

function Tumbler({ parent, onChange }) {
    const textureButtonOff = PIXI.Texture.from('off_tumbler.png');
    const textureButtonOn = PIXI.Texture.from('on_tumbler.png');
    const button = new PIXI.Sprite(textureButtonOff);
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
    this.container = new PIXI.Container();
    parent.addChild(this.container);
    this.texturesData = Array(scales.length).fill(null).map((_, textureIndex) => {
        /*let buff = new Uint8Array(width * height * 4);
        buff.forEach((_, bufferIndex) => {
            //RGBA
            [0, 0, 255, 255].forEach((colorChannel, colorChannelIndex) => {
                buff[bufferIndex * 4 + colorChannelIndex] = colorChannel;
            });
        });*/
        let width = 40 * scales[textureIndex];
        let height = 20 * scales[textureIndex];
        const texture = PIXI.Texture.fromBuffer(/*buff*/null, width, height);

        const material = new PIXI.MeshMaterial(texture, {
            program: PIXI.Program.from(vert, frag),
            uniforms: {
                iTime: 0,
                iMouse: [0, 0],
                iScale: scales[textureIndex],
            },
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
                    width / height, 0,
                    width / height, 1,
                    0, 1,
                ], 2)
            .addIndex([0, 1, 2, 0, 2, 3]);

        let mesh = new PIXI.Mesh(geometry, material);
        let renderTexture = new PIXI.RenderTexture.create({ width, height, scaleMode: PIXI.SCALE_MODES.NEAREST });

        let sprite = new PIXI.Sprite(renderTexture);
        sprite.anchor.set(0.5, 0.5);
        sprite.position.set(400, 300);
        sprite.scale.set(20 / scales[textureIndex], 20 / scales[textureIndex]);
        sprite.interactive = true;
        sprite.buttonMode = true;
        mesh.mouse = {
            x: 0,
            y: 0,
        };
        sprite.visible = (textureIndex === 0);
        sprite.on('pointertap', function(event) {
            console.log('PointerTap event');
            let localPosition = event.data.getLocalPosition(event.currentTarget);
            mesh.mouse.x = localPosition.x + 20 * 20;
            mesh.mouse.y = localPosition.y + 10 * 20;
            console.log('X', mesh.mouse.x, 'Y', mesh.mouse.y);
        });
        this.container.addChild(sprite);
        return { sprite, mesh, renderTexture };
    });

    this.mesh = this.texturesData[0].mesh;
    this.renderTexture = this.texturesData[0].renderTexture;

    this.tumbler = new Tumbler({
        switcher: this,
        parent,
        onChange: (off) => {
            this.scale = off ? scales[0] : scales[1];
            this.texturesData.forEach(({ sprite }) => {
                sprite.visible = !sprite.visible;
            });
            this.mesh = this.texturesData[off ? 0 : 1].mesh;
            this.renderTexture = this.texturesData[off ? 0 : 1].renderTexture;
            console.log(off);
        },
    });
}

TextureSwitcher.prototype.update = function(app) {
    this.mesh.shader.uniforms.iTime = app.ticker.lastTime / 300;
    this.mesh.shader.uniforms.iMouse = [this.mesh.mouse.x, this.mesh.mouse.y];
    app.renderer.render(this.mesh, { renderTexture: this.renderTexture });

};