import React, { useEffect } from 'react';
import { useCanvasContext } from '@/hooks/useCanvas';
import {resolution} from '@/components/interfaces';
const Pixelating = ({ onRatioChange, shaders: { vert, frag, uniforms }, resolutions }: {
        resolutions: Array<resolution>;
        shaders: { vert: string, frag: string, uniforms: any };
        onRatioChange: (pixelatingCanvasContext: WebGL2RenderingContext, resolution:resolution) => void;
    }) => {
        const { context } = useCanvasContext();
        const defaultValue = 0;
        let program: WebGLProgram | null;
        useEffect(() => {
            if (context) {
                context.canvas.width = resolutions[defaultValue]!.width;
                context.canvas.height = resolutions[defaultValue]!.height;
                context.viewport(0, 0, context.canvas.width, context.canvas.height);
                // Функция создания шейдера
                const getShader = (type: GLenum, shaderCode: string) => {
                    const shader = context.createShader(type);
                    if (shader) {
                        context.shaderSource(shader, shaderCode);
                        context.compileShader(shader);
                        if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
                            console.log('Ошибка компиляции шейдера: ' + context.getShaderInfoLog(shader));
                            context.deleteShader(shader);
                            return null;
                        }
                        return shader;
                    } else {
                        return null;
                    }
                };
                const fragmentShader = getShader(context.FRAGMENT_SHADER, frag);
                const vertexShader = getShader(context.VERTEX_SHADER, vert);
                // setup GLSL program
                program = context.createProgram();
                if (program && vertexShader && fragmentShader) {
                    context.attachShader(program, vertexShader);
                    context.attachShader(program, fragmentShader);
                    context.linkProgram(program);

                    if (!context.getProgramParameter(program, context.LINK_STATUS)) {
                        context.deleteProgram(program);
                        console.log('ERROR linking program!', context.getProgramInfoLog(program));
                        throw 'Не удалось установить шейдеры';
                    } else {
                        //attributes
                        const positionLocation = context.getAttribLocation(program, 'a_position');
                        const texcoordLocation = context.getAttribLocation(program, 'a_texcoord');

                        const positionBuffer = context.createBuffer();
                        context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
                        context.bufferData(
                            context.ARRAY_BUFFER,
                            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
                            context.STATIC_DRAW,
                        );

                        // provide texture coordinates for the rectangle.
                        const texcoordBuffer = context.createBuffer();
                        context.bindBuffer(context.ARRAY_BUFFER, texcoordBuffer);
                        // Set Texcoords.
                        context.bufferData(
                            context.ARRAY_BUFFER,
                            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
                            context.STATIC_DRAW,
                        );

                        // Tell it to use our program (pair of shaders)
                        context.useProgram(program);
                        context.enableVertexAttribArray(positionLocation);
                        context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);
                        context.vertexAttribPointer(positionLocation, 2, context.FLOAT, false, 0, 0);

                        context.enableVertexAttribArray(texcoordLocation);
                        context.bindBuffer(context.ARRAY_BUFFER, texcoordBuffer);
                        context.vertexAttribPointer(texcoordLocation, 2, context.FLOAT, false, 0, 0);

                        //uniforms
                        const iScaleWidth = context.getUniformLocation(program, 'iScaleWidth');
                        const iScaleHeight = context.getUniformLocation(program, 'iScaleHeight');

                        context.uniform1f(iScaleWidth, resolutions[0]!.width);
                        context.uniform1f(iScaleHeight, resolutions[0]!.height);

                        Object.keys(uniforms).forEach((uniformName) => {
                            const uniformLocation = context.getUniformLocation(program!, uniformName);
                            if (uniforms[uniformName].type === 'uniform3fv') {
                                context.uniform3fv(uniformLocation, uniforms[uniformName].data);
                            }
                            if (uniforms[uniformName].type === 'uniform3iv') {
                                context.uniform3iv(uniformLocation, uniforms[uniformName].data);
                            }
                            if (uniforms[uniformName].type === 'uniform2f') {
                                context.uniform2f(uniformLocation, uniforms[uniformName].data[0],
                                    uniforms[uniformName].data[1]);
                            }
                        });
                        // Create a texture to render to
                        const targetTexture = context.createTexture();
                        context.bindTexture(context.TEXTURE_2D, targetTexture);
                        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST);
                        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST);
                        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);
                        context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);

                        // Create and bind the framebuffer
                        const fb = context.createFramebuffer();
                        context.bindFramebuffer(context.FRAMEBUFFER, fb);
                        context.framebufferTexture2D(
                            context.FRAMEBUFFER,
                            context.COLOR_ATTACHMENT0,
                            context.TEXTURE_2D,
                            targetTexture,
                            0,
                        );

                        // render to the canvas
                        context.bindFramebuffer(context.FRAMEBUFFER, null);
                        context.bindTexture(context.TEXTURE_2D, targetTexture);
                        const render = (time: number) => {
                            // convert to seconds
                            time *= 0.001;
                            context.useProgram(program);
                            const iTimeLocation = context.getUniformLocation(program!, 'iTime');
                            context.uniform1f(iTimeLocation, time);
                            context.drawArrays(context.TRIANGLES, 0, 6);

                            if (uniforms.iMouse) {
                                const iMouse = context.getUniformLocation(program!, 'iMouse');
                                context.uniform2f(iMouse, uniforms.iMouse.data[0], uniforms.iMouse.data[1]);
                            }

                            requestAnimationFrame(render);
                        };
                        render(0);
                    }
                }
            }
        }, [context]);
        const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (context) {
                const valueAsNumber = event.target.valueAsNumber;
                const resolution = resolutions[valueAsNumber];
                onRatioChange(context, resolution);
                context.canvas.width = resolution.width;
                context.canvas.height = resolution.height;
                if (program) {
                    const iScaleWidth = context.getUniformLocation(program, 'iScaleWidth');
                    const iScaleHeight = context.getUniformLocation(program, 'iScaleHeight');
                    context.uniform1f(iScaleWidth, resolution.width);
                    context.uniform1f(iScaleHeight, resolution.height);
                }

                context.viewport(0, 0, context.canvas.width, context.canvas.height);
                //event.target.nextSibling! - label element
                event.target.nextSibling!.textContent = `${resolution.width}x${resolution.height}`;
            }
        };
        return (
            <>
                Resolution:
                <input
                    className={`w-52 m-0`}
                    type="range"
                    name="slider"
                    defaultValue={defaultValue}
                    min="0"
                    max={resolutions.length - 1}
                    onChange={onChange}
                />
                <label htmlFor="slider">
                    {`${resolutions[defaultValue]!.width}x${resolutions[defaultValue]!.height}`}
                </label>

            </>
        );
    }
;

export default Pixelating;
