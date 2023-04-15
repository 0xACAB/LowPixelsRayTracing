let core = require('@pixi/core');
core.generateProgram = (gl, program) => {
    console.log('Перехватил');
    debugger
};
core.ShaderSystem.prototype.generateProgram = (shader) => {
    console.log('Перехватил');
    debugger
};
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

import { modelShaderString } from '../shaders/model';
import vert from '../shaders/shader.vert';

//Подгружаю шейдеры
//Склеиваю шейдеры в один для передачи в PIXI.Program
//В конце каждого из файлов шейдеров надо переводить каретку
import uniforms from '../shaders/uniforms.frag';
import shader from '../shaders/shader.frag';

const frag = uniforms + modelShaderString + shader;

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
            ].map((pointData, index) => {
                if (index % 3 === 0) return pointData;
                if (index % 3 === 1) {
                    return -1 * (pointData - 11);
                }
                if (index % 3 === 2) {
                    return 30;
                }
            }),
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

    let m3 = {
        projection: function(width, height) {
            // Note: This matrix flips the Y axis so that 0 is at the top.
            return [
                2 / width, 0, 0,
                0, -2 / height, 0,
                -1, 1, 1
            ];
        },

        identity: function() {
            return [
                1, 0, 0,
                0, 1, 0,
                0, 0, 1,
            ];
        },

        translation: function(tx, ty) {
            return [
                1, 0, 0,
                0, 1, 0,
                tx, ty, 1,
            ];
        },

        rotation: function(angleInRadians) {
            var c = Math.cos(angleInRadians);
            var s = Math.sin(angleInRadians);
            return [
                c,-s, 0,
                s, c, 0,
                0, 0, 1,
            ];
        },

        scaling: function(sx, sy) {
            return [
                sx, 0, 0,
                0, sy, 0,
                0, 0, 1,
            ];
        },

        multiply: function(a, b) {
            var a00 = a[0 * 3 + 0];
            var a01 = a[0 * 3 + 1];
            var a02 = a[0 * 3 + 2];
            var a10 = a[1 * 3 + 0];
            var a11 = a[1 * 3 + 1];
            var a12 = a[1 * 3 + 2];
            var a20 = a[2 * 3 + 0];
            var a21 = a[2 * 3 + 1];
            var a22 = a[2 * 3 + 2];
            var b00 = b[0 * 3 + 0];
            var b01 = b[0 * 3 + 1];
            var b02 = b[0 * 3 + 2];
            var b10 = b[1 * 3 + 0];
            var b11 = b[1 * 3 + 1];
            var b12 = b[1 * 3 + 2];
            var b20 = b[2 * 3 + 0];
            var b21 = b[2 * 3 + 1];
            var b22 = b[2 * 3 + 2];
            return [
                b00 * a00 + b01 * a10 + b02 * a20,
                b00 * a01 + b01 * a11 + b02 * a21,
                b00 * a02 + b01 * a12 + b02 * a22,
                b10 * a00 + b11 * a10 + b12 * a20,
                b10 * a01 + b11 * a11 + b12 * a21,
                b10 * a02 + b11 * a12 + b12 * a22,
                b20 * a00 + b21 * a10 + b22 * a20,
                b20 * a01 + b21 * a11 + b22 * a21,
                b20 * a02 + b21 * a12 + b22 * a22,
            ];
        },

        translate: function(m, tx, ty) {
            return m3.multiply(m, m3.translation(tx, ty));
        },

        rotate: function(m, angleInRadians) {
            return m3.multiply(m, m3.rotation(angleInRadians));
        },

        scale: function(m, sx, sy) {
            return m3.multiply(m, m3.scaling(sx, sy));
        },
    };

    let gl;
    let shaderProgram;
    let indexBuffer; //буфер индексов
    let aUvsBuffer;

    // Функция создания шейдера
    function getShader(type, id) {
        var source = document.getElementById(id).innerHTML;

        var shader = gl.createShader(type);

        gl.shaderSource(shader, source);

        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('Ошибка компиляции шейдера: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    function main() {
        // Get A WebGL context
        var canvas = document.querySelector('#c');
        gl = canvas.getContext('webgl');
        if (!gl) {
            return;
        }
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;

        let fragmentShader = getShader(gl.FRAGMENT_SHADER, 'shader-fs');
        let vertexShader = getShader(gl.VERTEX_SHADER, 'shader-vs');
        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert('Не удалось установить шейдеры');
        }

        // look up where the vertex data needs to go.
        shaderProgram.aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        shaderProgram.aUvs = gl.getAttribLocation(shaderProgram, "aUvs");

        // lookup uniforms
        let matrixLocation = gl.getUniformLocation(shaderProgram, "u_matrix");

        // Create a buffer to put positions in
        let positionBuffer = gl.createBuffer();
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


        let indices = [0, 1, 2, 0, 2, 3];
        // создание буфера индексов
        indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        //Указываем число индексов это число равно числу индексов
        indexBuffer.numberOfItems = indices.length;

        const ratio = width / height;
        const aUvs = [
            0 - 1, 0,
            ratio - 1, 0,
            ratio - 1, 1,
            0 - 1, 1,
        ];
        //установка буфера вершин
        aUvsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, aUvsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(aUvs), gl.STATIC_DRAW);
        // размерность
        aUvsBuffer.itemSize = 2;
        aUvsBuffer.numItems = 4;

        let translation = [10, 10];
        let angleInRadians = 0;
        let scale = [1, 1];

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        // Clear the canvas.
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(shaderProgram);

        // Turn on the attribute
        gl.enableVertexAttribArray(shaderProgram.aVertexPosition);
        // Turn on the attribute
        gl.enableVertexAttribArray(shaderProgram.aUvs);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(shaderProgram.aVertexPosition,
            2, gl.FLOAT, false, 0, 0);
        gl.vertexAttribPointer(shaderProgram.aUvs,
            aUvsBuffer.itemSize, gl.FLOAT, false, 0, 0);

        // Compute the matrices
        let matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
        matrix = m3.translate(matrix, translation[0], translation[1]);
        matrix = m3.rotate(matrix, angleInRadians);
        matrix = m3.scale(matrix, scale[0], scale[1]);

        // Set the matrix.
        gl.uniformMatrix3fv(matrixLocation, false, matrix);

        //Отрисовка треугольников
        gl.drawElements(gl.TRIANGLES, indexBuffer.numberOfItems, gl.UNSIGNED_SHORT, 0);

        // Draw the geometry.
        //gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    main();

}

TextureSwitcher.prototype.update = function(app) {
    this.mesh.shader.uniforms.iTime = app.ticker.lastTime / 500;
    this.mesh.shader.uniforms.iMouse = [this.mesh.mouse.x, this.mesh.mouse.y];
    app.renderer.render(this.mesh, { renderTexture: this.renderTexture });
};