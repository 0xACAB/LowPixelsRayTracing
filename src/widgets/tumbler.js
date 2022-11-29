import * as PIXI from 'pixi.js';
import { vert } from '../shaders/vertex';
import { frag } from '../shaders/fragment';

export function Tumbler({ parent, scale, onChange }) {

    this.container = new PIXI.Container();
    parent.addChild(this.container);
    const textureButtonOff = PIXI.Texture.from('off_tumbler.png');
    const textureButtonOn = PIXI.Texture.from('on_tumbler.png');
    this.container.addChild(this.getReInitSprite(scale));
    const button = new PIXI.Sprite(textureButtonOff);
    button.position.set(600, 50);
    button.anchor.set(0.5);
    button.interactive = true;
    button.cursor = 'pointer';
    button.off = true;
    let _self = this;
    button.on('pointerup', function() {
        onChange(button.off ? 'Выключено' : 'Включено');
        if (button.off) {
            _self.getReInitSprite(1);
            _self.container.addChild(_self.getReInitSprite(1));
            this.texture = textureButtonOn;
            button.off = false;
        } else {
            _self.getReInitSprite(scale);
            _self.container.addChild(_self.getReInitSprite(scale));
            this.texture = textureButtonOff;
            button.off = true;
        }
    });
    parent.addChild(button);

}

Tumbler.prototype.test = function() {
    return 'test';
};

Tumbler.prototype.getReInitSprite = function(scale) {
    if (this.container.children.length){
        this.container.children[0].destroy({texture:true, baseTexture:true});
    }
    let width = 40 * scale;
    let height = 20 * scale;
    const texture = PIXI.Texture.fromBuffer(/*buff*/null, width, height);
    const material = new PIXI.MeshMaterial(texture, {
        program: PIXI.Program.from(vert, frag),
        uniforms: {
            iTime: 0,
            iMouse: [0, 0],
            iScale: scale
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

    let mesh = new PIXI.Mesh(geometry, material);
    let renderTexture = new PIXI.RenderTexture.create({ width, height, scaleMode: PIXI.SCALE_MODES.NEAREST });

    let sprite = new PIXI.Sprite(renderTexture);
    sprite.anchor.set(0.5, 0.5);
    sprite.position.set(400, 300);
    sprite.scale.set(20 / scale, 20 / scale);
    sprite.interactive = true;
    sprite.buttonMode = true;
    this.mouse = {
        x: 0,
        y: 0,
    };
    let _self = this;
    sprite.on('pointertap', function(event) {
        console.log('PointerTap event');
        let localPosition = event.data.getLocalPosition(event.currentTarget);
        _self.mouse.x = localPosition.x + 20 * 20;
        _self.mouse.y = localPosition.y + 10 * 20;
        console.log('X', mouse.x, 'Y', mouse.y);
    });
    this.mesh = mesh;
    this.renderTexture = renderTexture;
    return sprite;
};