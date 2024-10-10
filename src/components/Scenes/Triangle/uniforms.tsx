const uniforms = [
    {
        name: 'trianglesPoints',
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
    {
        name: 'trianglesData',
        type: 'uniform3iv',
        data: [0, 1, 2],
    },
    {
        name: 'trianglesColors',
        type: 'uniform3fv',
        data: [
            //white triangle
            1.0, 1.0, 1.0
        ],
    },
    {
        name: 'iMouse',
        type: 'uniform2f',
        data: [1.0,0.0],
    }
];
export default uniforms;
