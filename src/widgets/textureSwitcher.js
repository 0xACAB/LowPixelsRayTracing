import {
    Container,
    Sprite,
    Texture,
    Geometry,
    Mesh,
    BaseRenderTexture,
    RenderTexture,
    SCALE_MODES,
    Shader,
} from 'pixi.js';

import {meshPoints, meshTrianglesData} from './sceneData';
import m3 from './matrixes';
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
            meshTrianglesData: meshTrianglesData
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

export function TextureSwitcher2(scales) {
    // Get A WebGL context
    const canvas = document.querySelector('#mainCanvas');
    const gl = canvas.getContext('webgl');
    if (!gl) {
        return;
    } else {
        this.gl = gl;
    }
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;

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
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Не удалось установить шейдеры');
    }

    // look up where the vertex data needs to go.
    shaderProgram.aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    shaderProgram.aTexCoord = gl.getAttribLocation(shaderProgram, "aTexCoord");

    // lookup uniforms
    const matrixLocation = gl.getUniformLocation(shaderProgram, "u_matrix");
    const iTimeLocation = gl.getUniformLocation(shaderProgram, "iTime");
    const iMouse = gl.getUniformLocation(shaderProgram, "iMouse");
    const iScaleWidth = gl.getUniformLocation(shaderProgram, "iScaleWidth");
    const iScaleHeight = gl.getUniformLocation(shaderProgram, "iScaleHeight");
    const meshPointsLocation = gl.getUniformLocation(shaderProgram, "meshPoints");
    const meshTrianglesDataLocation = gl.getUniformLocation(shaderProgram, "meshTrianglesData");
    // Create a buffer to put positions in
    const positionBuffer = gl.createBuffer();
    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const width = scales[0].width;
    const height = scales[0].height;
    const vertices = [
        0, 0,
        width, 0,
        width, height,
        0, height,
    ];
    // Put geometry data into buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


    const indices = [0, 1, 2, 0, 2, 3];
    //Создание буфера индексов
    const indexBuffer = gl.createBuffer(); //буфер индексов
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    //Указываем число индексов это число равно числу индексов
    indexBuffer.numberOfItems = indices.length;

    const ratio = width / height;
    const aTexCoord = [
        0 - 1, 0,
        ratio - 1, 0,
        ratio - 1, 1,
        0 - 1, 1,
    ];

    //установка буфера вершин
    const aTexCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, aTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(aTexCoord), gl.STATIC_DRAW);
    // размерность
    aTexCoordBuffer.itemSize = 2;
    aTexCoordBuffer.numItems = 4;

    const translation = [0, 0];
    const angleInRadians = 0;
    const scale = [1, 1];

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(shaderProgram);

    // Turn on the attribute
    gl.enableVertexAttribArray(shaderProgram.aVertexPosition);
    // Turn on the attribute
    gl.enableVertexAttribArray(shaderProgram.aTexCoord);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(shaderProgram.aVertexPosition,
        2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribPointer(shaderProgram.aTexCoord,
        aTexCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Compute the matrices
    let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
    matrix = m3.translate(matrix, translation[0], translation[1]);
    matrix = m3.rotate(matrix, angleInRadians);
    matrix = m3.scale(matrix, scale[0], scale[1]);

    // Set the matrix.
    gl.uniformMatrix3fv(matrixLocation, false, matrix);
    gl.uniform1f(iTimeLocation, 0);
    gl.uniform2f(iMouse,  0, 0);
    gl.uniform1f(iScaleWidth, scales[0/*texturesDataIndex*/].width / ratio);
    gl.uniform1f(iScaleHeight, scales[0/*texturesDataIndex*/].height);
    gl.uniform3fv(meshPointsLocation,  meshPoints);
    gl.uniform3fv(meshTrianglesDataLocation,  meshTrianglesData);

    //Отрисовка треугольников
    gl.drawElements(gl.TRIANGLES, indexBuffer.numberOfItems, gl.UNSIGNED_SHORT, 0);

    matrix = m3.scale(matrix, 4, 4);
    // Set the matrix.
    gl.uniformMatrix3fv(matrixLocation, false, matrix);
    // Draw the geometry.
    //gl.drawArrays(gl.TRIANGLES, 0, 6);

}
TextureSwitcher2.prototype.update2 = function(timestamp) {
    //this.gl.uniform1f(this.iTimeLocation, timestamp);
    console.log(timestamp);
};