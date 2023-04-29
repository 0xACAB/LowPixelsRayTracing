/*Матрицы используются для определения местонахождения квадрата, где рендерится
* в частности поэтому aVertexPosition имеет тип vec2
* */
attribute vec2 aVertexPosition;
attribute vec2 aTexCoord;
uniform mat3 u_matrix;

varying vec2 vTexCoord;
void main() {
    vTexCoord = aTexCoord;
    // Multiply the position by the matrix.
    gl_Position = vec4((u_matrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
}