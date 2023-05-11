import { trianglesPoints } from './sceneData';
import vert from '../shaders/shader.vert';
import frag from '../shaders/shader.frag';

function Slider(slider, onChange, startState) {
    this.state = startState;
    slider.addEventListener("input", (event) => {
        onChange(event.target.value);
    });
    onChange(startState);
}

function Tumbler(button, onChange, startState) {
    this.state = startState;
    button.addEventListener('click', () => {
        this.state = this.state ? 0 : 1;
        onChange(this.state);
        if (this.state) {
            button.style.backgroundImage = 'url(\'on_tumbler.png\')';
        } else {
            button.style.backgroundImage = 'url(\'off_tumbler.png\')';
        }
    });
    onChange(startState);
}

export function TextureSwitcher(canvas, slider, button, scales) {
    const gl = canvas.getContext('webgl2');
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

    const fragmentShader = getShader(gl.FRAGMENT_SHADER, frag);
    const vertexShader = getShader(gl.VERTEX_SHADER, vert);
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
    const trianglesPointsLocation = gl.getUniformLocation(program, 'trianglesPoints');

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(
        [
            -1, -1,
            1, -1,
            -1, 1,
            -1, 1,
            1, -1,
            1, 1,

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
    gl.uniform3fv(trianglesPointsLocation, trianglesPoints);

    // Create a texture to render to
    const targetTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, targetTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, scales[0].width, scales[0].height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Create and bind the framebuffer
    let fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, targetTexture, 0);

    // render to the canvas
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, targetTexture);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    function drawPlane(time) {
        gl.uniform1f(iTimeLocation, time);
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
    this.slider = new Slider(slider,
        (state) => {
            console.log(state);
            if (state) {
                canvas.width = scales[state].width;
                canvas.height = scales[state].height;
            } else {
                canvas.width = scales[state].width;
                canvas.height = scales[state].height;
            }
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        },
        0)
    /*this.tumbler = new Tumbler(
        button,
        (state) => {
            console.log(state);
            if (state) {
                canvas.width = scales[0].width;
                canvas.height = scales[0].height;
            } else {
                canvas.width = scales[1].width;
                canvas.height = scales[1].height;
            }
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        },
        0,
    );*/
}