import { trianglesPoints } from './sceneData';
import vert from '../shaders/shader.vert';
import frag from '../shaders/shader.frag';
import vert2 from '../shaders/shader2.vert';
import frag2 from '../shaders/shader2.frag';

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
        const width = scales[texturesDataIndex].width;
        const height = scales[texturesDataIndex].height;
        const ratio = width / height;

        const shader = Shader.from(vert, frag, {
            iTime: 0,
            iMouse: [0, 0],
            iScaleWidth: scales[texturesDataIndex].width / ratio,
            iScaleHeight: scales[texturesDataIndex].height,
            meshPoints: meshPoints,
            meshTrianglesData: meshTrianglesData,
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
                    0 - 1, 0,
                    ratio - 1, 0,
                    ratio - 1, 1,
                    0 - 1, 1,
                ], 2)
            .addIndex([0, 1, 2, 0, 2, 3]);
        const mesh = new Mesh(geometry, shader);
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
            mesh.mouse.x = (event.global.x - event.target.position.x - event.target.width / 2) / spriteScale.x;
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
            /*if (state===0){
                this.app&&this.app.renderer.render(this.mesh, { renderTexture: this.renderTexture });
            }*/
        },
        startState: 0,
    });
}

TextureSwitcher.prototype.update = function(app) {
    this.mesh.shader.uniforms.iTime = app.ticker.lastTime / 500;
    this.mesh.shader.uniforms.iMouse = [this.mesh.mouse.x, this.mesh.mouse.y];
    app.renderer.render(this.mesh, { renderTexture: this.renderTexture });
};

export function TextureSwitcher2(canvas, scales) {
    const gl = canvas.getContext('webgl');
    if (!gl) {
        return;
    }

    // Функция создания шейдера
    function getShader(type, shaderCodeStr) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, shaderCodeStr);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('Ошибка компиляции шейдера: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const fragmentShader = getShader(gl.FRAGMENT_SHADER, frag2);
    const vertexShader = getShader(gl.VERTEX_SHADER, vert2);
    // setup GLSL program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert('Не удалось установить шейдеры');
    }
    //attributes
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const texcoordLocation = gl.getAttribLocation(program, 'a_texcoord');

    //uniforms
    const iTimeLocation = gl.getUniformLocation(program, 'iTime');
    const iMouse = gl.getUniformLocation(program, 'iMouse');
    const iScaleWidth = gl.getUniformLocation(program, 'iScaleWidth');
    const iScaleHeight = gl.getUniformLocation(program, 'iScaleHeight');
    const meshTrianglesLocation = gl.getUniformLocation(program, 'trianglesPoints');

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(
        [
            -1, -1,
            1, -1,
            -1, 1,
            -1, 1,
            1, -1,
            1, 1

        ]), gl.STATIC_DRAW);

    // provide texture coordinates for the rectangle.
    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    // Set Texcoords.
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(
            [
                -2, -1,
                2, -1,
                -2, 1,
                -2, 1,
                2, -1,
                2, 1,
            ]),
        gl.STATIC_DRAW);

    // Create a texture to render to
    const targetTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, targetTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, scales[0].width, scales[0].height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Create and bind the framebuffer
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, targetTexture, 0);

    // render to the canvas
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, targetTexture);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(texcoordLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2f(iMouse, 0, 0);
    gl.uniform1f(iScaleWidth, scales[0].width);
    gl.uniform1f(iScaleHeight, scales[0].height);
    /*gl.uniform3fv(meshPointsLocation, [
        0,0,0,
        0,0,0,
        0,0,0
    ]);
    gl.uniform1iv(meshTrianglesDataLocation, [0,0,0]);*/

    gl.uniform3fv(meshTrianglesLocation, trianglesPoints);

    function drawPlane(time) {
        if (time>5){
            gl.uniform3fv(meshTrianglesLocation, trianglesPoints);
        }
        gl.uniform1f(iTimeLocation, time);
        // Draw the geometry.
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    // Get the starting time.
    let then = 0;
    // Draw the scene.
    function drawScene(time) {
        // convert to seconds
        time *= 0.001;
        // Subtract the previous time from the current time
        var deltaTime = time - then;
        // Remember the current time for the next frame.
        then = time;

        drawPlane(time);
        requestAnimationFrame(drawScene);
    }
    requestAnimationFrame(drawScene);
}