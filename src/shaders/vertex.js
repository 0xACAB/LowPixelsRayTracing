
/*Матрицы используются для определения местонахождения квадрата, где рендерится
* в частности поэтому aVertexPosition имеет тип vec2
* */
export let vert = `
        attribute vec2 aVertexPosition;
        attribute vec3 aUvs;
        
        uniform mat3 translationMatrix;
        uniform mat3 projectionMatrix;
        
        varying vec3 vUvs;
        
        void main(void) {
            vUvs = aUvs;
            gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
        }
    `;