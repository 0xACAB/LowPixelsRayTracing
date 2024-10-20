const uniforms = {
    trianglesPoints: {
        type: 'uniform3fv',
        data: [
            1.0,
            1.0,
            -1.0,

            -1.0,
            1.0,
            -1.0,

            -1.0,
            -1.0,
            -1.0,
        ],
    },
    trianglesData: {
        type: 'uniform3iv',
        data: [0, 1, 2],
    },
    trianglesColors: {
        type: 'uniform3fv',
        data: [
            //white triangle
            1.0, 1.0, 1.0,
        ],
    },
    iMouse: {
        type: 'uniform2f',
        data: [0.0, 0.0],
    },
};
export default uniforms;
