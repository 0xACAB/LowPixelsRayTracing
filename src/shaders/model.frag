#define pointsCount 8
#define trianglesCount 10

vec3 meshPoints[pointsCount];
int meshTrianglesData[3*trianglesCount];
vec3 meshTrianglesColors[trianglesCount];

void initMeshPoints(){
    //Cornell box
    meshPoints[0]=vec3(2.5, 2.5, 50.0);
    meshPoints[1]=vec3(2.5, 2.5, 30.0);
    meshPoints[2]=vec3(2.5, -2.5, 30.0);
    meshPoints[3]=vec3(2.5, -2.5, 50.0);
    meshPoints[4]=vec3(-2.5, 2.5, 50.0);
    meshPoints[5]=vec3(-2.5, -2.5, 50.0);
    meshPoints[6]=vec3(-2.5, 2.5, 30.0);
    meshPoints[7]=vec3(-2.5, -2.5, 30.0);
}

void initMeshTrianglesData(){
    //A white back wall
    /*0, 4, 5,
    0, 3, 5,*/
    meshTrianglesData[0]=0;
    meshTrianglesData[1]=4;
    meshTrianglesData[2]=5;
    meshTrianglesData[3]=0;
    meshTrianglesData[4]=3;
    meshTrianglesData[5]=5;


    //A green right wall
    /*0, 1, 2,
    3, 0, 2,*/

    meshTrianglesData[6]=0;
    meshTrianglesData[7]=1;
    meshTrianglesData[8]=2;
    meshTrianglesData[9]=3;
    meshTrianglesData[10]=0;
    meshTrianglesData[11]=2;
    //A red left wall
    /*4, 5, 6,
    5, 6, 7,*/
    meshTrianglesData[12]=4;
    meshTrianglesData[13]=5;
    meshTrianglesData[14]=6;
    meshTrianglesData[15]=5;
    meshTrianglesData[16]=6;
    meshTrianglesData[17]=7;
    //A white floor
    //top
    /*7, 3, 2,
    7, 3, 5,*/
    meshTrianglesData[18]=7;
    meshTrianglesData[19]=3;
    meshTrianglesData[20]=2;
    meshTrianglesData[21]=7;
    meshTrianglesData[22]=3;
    meshTrianglesData[23]=5;
    //bottom
    /*6, 4, 0,
    6, 0, 1,*/

    meshTrianglesData[24]=6;
    meshTrianglesData[25]=4;
    meshTrianglesData[26]=0;
    meshTrianglesData[27]=6;
    meshTrianglesData[28]=0;
    meshTrianglesData[29]=1;
}

void initMeshTrianglesColors(){
    //Cornell box
    //A white back wall
    meshTrianglesColors[0]=vec3(1.0, 1.0, 1.0);
    meshTrianglesColors[1]=vec3(1.0, 1.0, 1.0);
    //A green right wall
    meshTrianglesColors[2]=vec3(0.0, 1.0, 0.0);
    meshTrianglesColors[3]=vec3(0.0, 1.0, 0.0);
    //A red left wall
    meshTrianglesColors[4]=vec3(1.0, 0.0, 0.0);
    meshTrianglesColors[5]=vec3(1.0, 0.0, 0.0);
    //A white floor
    //top
    meshTrianglesColors[6]=vec3(1.0, 1.0, 1.0);
    meshTrianglesColors[7]=vec3(1.0, 1.0, 1.0);
    //bottom
    meshTrianglesColors[8]=vec3(1.0, 1.0, 1.0);
    meshTrianglesColors[9]=vec3(1.0, 1.0, 1.0);
}
