import React from 'react';
import { resolution } from '@/components/interfaces';

const getShader = (context: WebGL2RenderingContext, type: GLenum, shaderCode: string) => {
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
const Pixelating = (
	{
		context,
		shaders: { vert, frag, uniforms },
		resolutions,
		defaultResolution = 0,
	}: {
		context: WebGL2RenderingContext | null,
		shaders: { vert: string, frag: string, uniforms: any };
		resolutions: Array<resolution>;
		defaultResolution?: number,
	}) => {
	if (context) {
		const fragmentShader = getShader(context, context.FRAGMENT_SHADER, frag);
		const vertexShader = getShader(context, context.VERTEX_SHADER, vert);
		const program = context.createProgram();
		if (program && vertexShader && fragmentShader) {
			context.attachShader(program, vertexShader);
			context.attachShader(program, fragmentShader);
			context.linkProgram(program);

			if (!context.getProgramParameter(program, context.LINK_STATUS)) {
				context.deleteProgram(program);
				console.log('ERROR linking program!', context.getProgramInfoLog(program));
				throw 'Не удалось установить шейдеры';
			} else {
				context.canvas.width = resolutions[defaultResolution].width;
				context.canvas.height = resolutions[defaultResolution].height;
				context.viewport(0, 0, context.canvas.width, context.canvas.height);

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

				context.uniform1f(iScaleWidth, resolutions[defaultResolution].width);
				context.uniform1f(iScaleHeight, resolutions[defaultResolution].height);

				const recursiveSetUniform = (prefix: string | undefined, subUniforms: any) => {
					Object.keys(subUniforms).forEach((uniformName) => {
						const uniform = subUniforms[uniformName];
						if (uniform.type !== 'struct') {
							const uniform = subUniforms[uniformName];
							const uniformLocation =
								context.getUniformLocation(program, prefix ? prefix + uniformName : uniformName);
							const setUniformFunction =
								(context[uniform.type as keyof typeof context] as any).bind(context);
							setUniformFunction(uniformLocation, uniform.data);
						} else {

							const newPrefix = prefix ? prefix + uniformName + '.' : uniformName + '.';
							recursiveSetUniform(newPrefix, subUniforms[uniformName].data);
						}
					});
				};
				recursiveSetUniform(undefined, uniforms);
				// Create a texture to render to
				const targetTexture = context.createTexture();
				context.bindTexture(context.TEXTURE_2D, targetTexture);

				// Create and bind the framebuffer
				context.bindFramebuffer(context.FRAMEBUFFER, context.createFramebuffer());
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
				const render = (time?: number, callback?: any) => {
					context.useProgram(program);
					context.drawArrays(context.TRIANGLES, 0, 6);

					if (time) {
						const iTimeLocation = context.getUniformLocation(program, 'iTime');
						context.uniform1f(iTimeLocation, time);
					}
					if (uniforms.iMouse) {
						const iMouse = context.getUniformLocation(program, 'iMouse');
						context.uniform2fv(iMouse, uniforms.iMouse.data);
					}
					if (callback) {
						callback(context, program);
					}
				};

				const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
					const valueAsNumber = event.target.valueAsNumber;
					const resolution = resolutions[valueAsNumber];
					context.canvas.width = resolution.width;
					context.canvas.height = resolution.height;
					context.viewport(0, 0, context.canvas.width, context.canvas.height);
					const iScaleWidth = context.getUniformLocation(program, 'iScaleWidth');
					const iScaleHeight = context.getUniformLocation(program, 'iScaleHeight');
					context.uniform1f(iScaleWidth, resolution.width);
					context.uniform1f(iScaleHeight, resolution.height);
					render();
				};
				return {
					context,
					render,
					onChange,
				};
			}
		}
	}
};

export interface IPixelating {
	context: WebGL2RenderingContext;
	render: (time: number, callback?: any) => void;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export { Pixelating };

