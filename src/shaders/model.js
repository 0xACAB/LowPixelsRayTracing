const vertices = [
    2.5, 2.5, 50.0,
    2.5, 2.5, 30.0,
    2.5, -2.5, 30.0,
    2.5, -2.5, 50.0,
    -2.5, 2.5, 50.0,
    -2.5, -2.5, 50.0,
    -2.5, 2.5, 30.0,
    -2.5, -2.5, 30.0,

    /*0.152493,9.028288,0.148813,
    0.249486,8.948933,0.243465,
    0.002603,9.028288,0.213056,
    0.004259,8.948933,0.348570,
    -0.148812,9.028288,0.152494,
    -0.243464,8.948933,0.249488,
    -0.213055,9.028288,0.002604,
    -0.348568,8.948933,0.004260,
    -0.213055,9.302430,0.002605,
    -0.152493,9.028288,-0.148811,
    -0.249486,8.948933,-0.243463,
    -0.002603,9.028288,-0.213053,
    -0.004259,8.948933,-0.348567,
    0.148812,9.028288,-0.152492,
    0.243464,8.948933,-0.249485,
    0.213054,9.028288,-0.002602,
    0.348568,8.948933,-0.004258,
    1.095930,6.969274,-0.001908,
    0.765514,6.969274,-0.772826,
    -0.013247,6.969274,-1.084310,
    -0.784167,6.969274,-0.753893,
    2.249831,0.000000,-0.027488,
    1.116463,2.413453,-0.013640,
    1.610308,-0.000000,1.571435,
    0.799104,2.413453,0.779814,
    0.027487,-0.000000,2.249832,
    0.013640,2.413453,1.116463,
    -1.571436,-0.000000,1.610309,
    -0.779814,2.413453,0.799104,
    -2.249833,-0.000000,0.027487,
    -1.116463,2.413453,0.013640,
    -1.610308,0.000000,-1.571436,
    -0.799104,2.413453,-0.779814,
    -0.027486,0.000000,-2.249832,
    -0.013640,2.413453,-1.116463,
    1.571436,0.000000,-1.610306,
    0.779814,2.413453,-0.799103,
    1.459176,2.111497,-0.017828,
    1.044399,2.111497,1.019188,
    0.017827,2.111497,1.459177,
    -1.019188,2.111497,1.044400,
    -1.459177,2.111497,0.017827,
    -1.044399,2.111497,-1.019188,
    -0.017827,2.111497,-1.459176,
    1.019188,2.111497,-1.044398,
    2.039333,0.541580,-0.024916,
    1.459645,0.541580,1.424409,
    0.024915,0.541580,2.039334,
    -1.424409,0.541580,1.459645,
    -2.039335,0.541580,0.024915,
    -1.459645,0.541580,-1.424410,
    -0.024915,0.541580,-2.039334,
    1.424410,0.541580,-1.459643,
    1.714876,0.696002,-0.020952,
    1.227416,0.696002,1.197786,
    0.020951,0.696002,1.714877,
    -1.197786,0.696002,1.227417,
    -1.714878,0.696002,0.020951,
    -1.227416,0.696002,-1.197787,
    -0.020951,0.696002,-1.714877,
    1.197787,0.696002,-1.227415,
    2.097947,1.326516,-0.025632,
    1.501597,1.326516,1.465349,
    0.025632,1.326516,2.097948,
    -1.465349,1.326516,1.501598,
    -2.097949,1.326516,0.025631,
    -1.501598,1.326516,-1.465349,
    -0.025631,1.326516,-2.097948,
    1.465350,1.326516,-1.501596,
    1.444163,2.236249,-0.017644,
    1.033654,2.236249,1.008701,
    0.017644,2.236249,1.444163,
    -1.008702,2.236249,1.033654,
    -1.444164,2.236249,0.017644,
    -1.033654,2.236249,-1.008702,
    -0.017643,2.236249,-1.444163,
    1.008702,2.236249,-1.033653,
    -0.008732,6.323641,-0.714764,
    0.499241,6.323641,-0.511589,
    0.714765,6.323641,-0.008732,
    0.511590,6.323641,0.499242,
    0.008733,6.323641,0.714767,
    -0.499241,6.323641,0.511592,
    -0.714766,6.323641,0.008734,
    -0.511590,6.323641,-0.499240,
    -0.019257,6.554924,-1.576259,
    1.100967,6.554923,-1.128199,
    1.576260,6.554923,-0.019257,
    1.128201,6.554923,1.100967,
    0.019258,6.554923,1.576261,
    -1.100967,6.554923,1.128203,
    -1.576261,6.554923,0.019259,
    -1.128202,6.554923,-1.100966,
    -0.013396,6.801265,-1.096483,
    0.765859,6.801265,-0.784802,
    1.096484,6.801265,-0.013395,
    0.784804,6.801265,0.765860,
    0.013396,6.801265,1.096486,
    -0.765859,6.801265,0.784806,
    -1.096485,6.801265,0.013397,
    -0.784804,6.801265,-0.765858,
    0.011282,7.048345,0.923464,
    -0.633555,7.048345,0.665548,
    -0.907149,7.048345,0.027205,
    -0.649232,7.048345,-0.617632,
    -0.010889,7.048345,-0.891226,
    0.633948,7.048345,-0.633309,
    0.907541,7.048345,0.005034,
    0.649625,7.048345,0.649871,
    -1.095650,6.969274,0.024868,
    -0.765234,6.969274,0.795788,
    0.013528,6.969274,1.107270,
    0.784447,6.969274,0.776854,
    0.011110,7.466897,0.909412,
    -0.627217,7.466897,0.654099,
    -0.898049,7.466897,0.022200,
    -0.642736,7.466897,-0.616127,
    -0.010837,7.466897,-0.886959,
    0.627490,7.466897,-0.631646,
    0.898322,7.466897,0.000252,
    0.643009,7.466897,0.638580,
    0.014489,8.583366,1.185936,
    0.848827,8.583366,0.828338,
    -0.828338,8.583366,0.848829,
    -1.185936,8.583366,0.014490,
    -0.848829,8.583366,-0.828336,
    -0.014490,8.583366,-1.185934,
    0.828336,8.583366,-0.848827,
    1.185934,8.583366,-0.014488,
    0.014489,8.583366,1.185936,
    0.848827,8.583366,0.828338,
    -0.828338,8.583366,0.848829,
    -1.185936,8.583366,0.014490,
    -0.848829,8.583366,-0.828336,
    -0.014490,8.583366,-1.185934,
    0.828336,8.583366,-0.848827,
    1.185934,8.583366,-0.014488,
    -0.002678,8.875105,-0.219200,
    0.153105,8.875105,-0.156892,
    -0.156893,8.875105,-0.153104,
    0.219201,8.875105,-0.002677,
    -0.219202,8.875105,0.002679,
    0.156893,8.875105,0.153106,
    -0.153105,8.875105,0.156894,
    0.002678,8.875105,0.219203,
    0.002603,9.850716,0.213057,
    0.152493,9.850716,0.148814,
    -0.148812,9.850716,0.152495,
    -0.213055,9.850716,0.002605,
    0.000000,9.975286,0.000002,
    -0.152493,9.850716,-0.148810,
    -0.002603,9.850716,-0.213053,
    0.148812,9.850716,-0.152491,
    0.213054,9.850716,-0.002601,
    -0.213055,9.576573,0.002605,
    0.213054,9.302430,-0.002601,
    0.213054,9.576573,-0.002601,
    -0.148812,9.576572,0.152495,
    -0.148812,9.302430,0.152495,
    0.148812,9.576572,-0.152491,
    0.148812,9.302430,-0.152491,
    0.002603,9.576572,0.213057,
    0.002603,9.302430,0.213057,
    0.152493,9.302430,0.148814,
    0.152493,9.576573,0.148814,
    -0.002603,9.576572,-0.213052,
    -0.002603,9.302430,-0.213052,
    -0.152493,9.302430,-0.148810,
    -0.152493,9.576573,-0.148810,
    -0.213055,9.302430,0.002605,
    -0.213055,9.576573,0.002605,
    0.213054,9.302430,-0.002601,
    0.213054,9.576573,-0.002601,
    -0.148812,9.576572,0.152495,
    -0.148812,9.302430,0.152495,
    0.148812,9.576572,-0.152491,
    0.148812,9.302430,-0.152491,
    -0.419512,9.153886,0.091092,
    -0.419512,9.725119,0.091093,
    0.419512,9.153886,-0.091090,
    0.419512,9.725119,-0.091089,
    -0.355269,9.725118,0.240983,
    -0.355269,9.153884,0.240982,
    0.355269,9.725118,-0.240979,
    0.355269,9.153884,-0.240980*/
];
const faces = [
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

    /*17,1,2,
    155,148,149,
    157,153,154,
    1,4,2,
    155,151,169,
    3,6,4,
    5,8,6,
    157,147,165,
    8,10,11,
    162,148,158,
    10,13,11,
    160,152,153,
    12,15,13,
    165,146,162,
    14,17,15,
    169,152,166,
    103,112,102,
    104,111,103,
    98,113,112,
    105,110,104,
    111,98,112,
    106,21,105,
    110,99,111,
    21,100,110,
    19,106,107,
    20,101,21,
    18,107,108,
    95,20,19,
    113,108,109,
    96,19,18,
    46,55,47,
    44,69,68,
    45,62,69,
    39,64,63,
    38,63,62,
    49,30,28,
    61,46,53,
    64,57,56,
    65,58,57,
    59,68,60,
    58,67,59,
    50,32,30,
    26,49,28,
    68,61,60,
    69,54,61,
    62,55,54,
    63,56,55,
    51,34,32,
    59,52,51,
    29,74,73,
    31,75,74,
    23,71,70,
    37,70,77,
    52,61,53,
    50,59,51,
    27,73,72,
    33,76,75,
    25,72,71,
    76,37,77,
    34,53,36,
    49,58,50,
    72,41,40,
    73,42,41,
    42,75,43,
    75,44,43,
    53,22,36,
    48,57,49,
    76,45,44,
    77,38,45,
    38,71,39,
    39,72,40,
    22,47,24,
    42,67,66,
    43,68,67,
    41,66,65,
    40,65,64,
    55,48,47,
    29,84,31,
    24,28,32,
    47,26,24,
    85,86,78,
    35,85,78,
    23,81,25,
    37,78,79,
    37,80,23,
    31,85,33,
    27,83,29,
    25,82,27,
    87,96,88,
    83,90,91,
    82,89,90,
    79,86,87,
    84,93,85,
    80,89,81,
    84,91,92,
    80,87,88,
    97,18,113,
    86,101,94,
    90,99,91,
    89,98,90,
    86,95,87,
    93,100,101,
    89,96,97,
    91,100,92,
    121,108,120,
    120,107,119,
    119,106,118,
    106,117,118,
    105,116,117,
    104,115,116,
    103,114,115,
    114,109,121,
    112,109,102,
    121,122,114,
    120,123,121,
    124,116,115,
    125,117,116,
    126,118,117,
    118,128,119,
    119,129,120,
    122,115,114,
    128,135,136,
    126,133,134,
    124,130,132,
    129,136,137,
    127,134,135,
    125,132,133,
    122,131,130,
    123,137,131,
    139,135,138,
    145,132,130,
    140,135,134,
    143,137,141,
    141,15,17,
    145,6,144,
    142,132,144,
    140,13,138,
    142,134,133,
    140,8,11,
    139,137,136,
    139,13,15,
    144,8,142,
    143,17,2,
    145,2,4,
    145,131,143,
    154,150,147,
    147,150,146,
    146,150,148,
    148,150,149,
    149,150,151,
    151,150,152,
    152,150,153,
    153,150,154,
    10,167,12,
    168,166,167,
    1,163,3,
    164,162,163,
    12,161,14,
    167,160,161,
    3,159,5,
    163,158,159,
    16,164,1,
    156,165,164,
    7,168,10,
    9,169,168,
    14,156,16,
    160,173,176,
    5,9,7,
    158,171,174,
    173,180,181,
    177,184,185,
    161,176,177,
    159,174,175,
    157,172,173,
    155,170,171,
    9,175,170,
    156,177,172,
    180,184,181,
    178,182,179,
    175,178,170,
    177,180,172,
    175,182,183,
    171,178,179,
    171,182,174,
    173,184,176,
    17,16,1,
    155,158,148,
    157,160,153,
    1,3,4,
    155,149,151,
    3,5,6,
    5,7,8,
    157,154,147,
    8,7,10,
    162,146,148,
    10,12,13,
    160,166,152,
    12,14,15,
    165,147,146,
    14,16,17,
    169,151,152,
    103,111,112,
    104,110,111,
    98,97,113,
    105,21,110,
    111,99,98,
    106,20,21,
    110,100,99,
    21,101,100,
    19,20,106,
    20,94,101,
    18,19,107,
    95,94,20,
    113,18,108,
    96,95,19,
    46,54,55,
    44,45,69,
    45,38,62,
    39,40,64,
    38,39,63,
    49,50,30,
    61,54,46,
    64,65,57,
    65,66,58,
    59,67,68,
    58,66,67,
    50,51,32,
    26,48,49,
    68,69,61,
    69,62,54,
    62,63,55,
    63,64,56,
    51,52,34,
    59,60,52,
    29,31,74,
    31,33,75,
    23,25,71,
    37,23,70,
    52,60,61,
    50,58,59,
    27,29,73,
    33,35,76,
    25,27,72,
    76,35,37,
    34,52,53,
    49,57,58,
    72,73,41,
    73,74,42,
    42,74,75,
    75,76,44,
    53,46,22,
    48,56,57,
    76,77,45,
    77,70,38,
    38,70,71,
    39,71,72,
    22,46,47,
    42,43,67,
    43,44,68,
    41,42,66,
    40,41,65,
    55,56,48,
    29,83,84,
    32,34,36,
    36,22,24,
    24,26,28,
    28,30,32,
    32,36,24,
    47,48,26,
    85,93,86,
    35,33,85,
    23,80,81,
    37,35,78,
    37,79,80,
    31,84,85,
    27,82,83,
    25,81,82,
    87,95,96,
    83,82,90,
    82,81,89,
    79,78,86,
    84,92,93,
    80,88,89,
    84,83,91,
    80,79,87,
    97,96,18,
    86,93,101,
    90,98,99,
    89,97,98,
    86,94,95,
    93,92,100,
    89,88,96,
    91,99,100,
    121,109,108,
    120,108,107,
    119,107,106,
    106,105,117,
    105,104,116,
    104,103,115,
    103,102,114,
    114,102,109,
    112,113,109,
    121,123,122,
    120,129,123,
    124,125,116,
    125,126,117,
    126,127,118,
    118,127,128,
    119,128,129,
    122,124,115,
    128,127,135,
    126,125,133,
    124,122,130,
    129,128,136,
    127,126,134,
    125,124,132,
    122,123,131,
    123,129,137,
    139,136,135,
    145,144,132,
    140,138,135,
    143,131,137,
    141,139,15,
    145,4,6,
    142,133,132,
    140,11,13,
    142,140,134,
    140,142,8,
    139,141,137,
    139,138,13,
    144,6,8,
    143,141,17,
    145,143,2,
    145,130,131,
    10,168,167,
    168,169,166,
    1,164,163,
    164,165,162,
    12,167,161,
    167,166,160,
    3,163,159,
    163,162,158,
    16,156,164,
    156,157,165,
    7,9,168,
    9,155,169,
    14,161,156,
    160,157,173,
    5,159,9,
    158,155,171,
    173,172,180,
    177,176,184,
    161,160,176,
    159,158,174,
    157,156,172,
    155,9,170,
    9,159,175,
    156,161,177,
    180,185,184,
    178,183,182,
    175,183,178,
    177,185,180,
    175,174,182,
    171,170,178,
    171,179,182,
    173,181,184*/
];
const colors = [
    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,

    0.0, 1.0, 0.0,
    0.0, 1.0, 0.0,

    1.0, 0.0, 0.0,
    1.0, 0.0, 0.0,

    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,

    1.0, 1.0, 1.0,
    1.0, 1.0, 1.0
]
const pointsCount = vertices.length/3;
const trianglesCount = faces.length/3;
export const modelShaderString =
    '#define pointsCount '+pointsCount+'\n'+
    '#define trianglesCount '+trianglesCount+'\n'+

    'vec3 meshPoints['+pointsCount+'];\n'+
    'int meshTrianglesData['+3*trianglesCount+'];\n'+
    'vec3 meshTrianglesColors['+trianglesCount+'];\n'+
    'void initMeshPoints(){\n'+
        Array(pointsCount)
            .fill(null)
            .map((_,index)=>{
                const points = vertices.slice(index*3,index*3+3);
                return 'meshPoints['+index+']=vec3('+points.join()+');\n';
        }).join('')+
    '}\n'+
    'void initMeshTrianglesData(){\n'+
    Array(faces.length)
        .fill(null)
        .map((_,index)=>{
            return 'meshTrianglesData['+index+']='+faces[index]+';\n';
        }).join('')+
    '}\n'+
    'void initMeshTrianglesColors(){\n'+
    Array(trianglesCount)
        .fill(null)
        .map((_,index)=>{
            const components = colors.slice(index*3,index*3+3)
            return 'meshTrianglesColors['+index+']=vec3('+components/*[1.0,1.0,1.0]*/.join()+');\n';
        }).join('')+
    '}\n';