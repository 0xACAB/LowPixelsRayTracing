const meshPoints = [
    1.5, 1.5, 50.0,
    1.5, 1.5, 30.0,
    1.5, -1.5, 30.0,
    1.5, -1.5, 50.0,
    -1.5, 1.5, 50.0,
    -1.5, -1.5, 50.0,
    -1.5, 1.5, 30.0,
    -1.5, -1.5, 30.0,
];
const v3Points = Array(meshPoints.length/3)
    .fill(null)
    .map((_,index)=>{
        return meshPoints.slice(index*3,index*3+3)
    });

const meshTrianglesData = [
    0, 4, 5,
    0, 3, 5,
    0, 1, 2,
    3, 0, 2,
    4, 5, 6,
    5, 6, 7,
    7, 3, 2,
    7, 3, 5,
    6, 4, 0,
    6, 0, 1
];

//Массив в котором треугольники перечислены просто последовательно по 3 точки
const trianglesPoints = Array(meshTrianglesData.length/3)
    .fill(null)
    .map((_,index)=>{
        return meshTrianglesData.slice(index*3,index*3+3).map((data)=>{
            return v3Points[data]
        })
    }).flat().flat();

export {trianglesPoints};