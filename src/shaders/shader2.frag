precision mediump  float;
varying vec2 vTexCoord;

uniform float iTime;
uniform vec2 iMouse;
uniform float iScaleWidth;
uniform float iScaleHeight;

#define pointsCount 89/*meshPoints.length/3*/
#define trianglesCount 168/*faces.length/3*/
uniform vec3 meshPoints[pointsCount];
uniform int meshTrianglesData[trianglesCount*3];

const float infini = 1.0 / 0.0;
struct Pixel {
    vec2 coordinate;
    vec3 color;
};

struct Camera {
    vec3 eye;
};

struct Ray {
    vec3 origin;
    vec3 direction;
};

struct Material {
    vec3 Kd;// diffuse color
    vec3 Ke;// emissive color
};

struct Sphere {
    vec3 position;
    float radius;
    Material material;
};

struct Triangle {
    vec3 points[3];
    int indexes[3];
    Material material;
};


struct Intersection {
    float t;
//vec3 P;
//vec3 N;
//Material material;
};

struct AABB {
    vec3 min;
    vec3 max;
};

Intersection intersection() {
    Intersection I;
    I.t = infini;
    return I;
}

Camera camera = Camera(
vec3(10.0/*-cos(iTime)*0.5*/, 10.0, -25.0/*-sin(iTime)*0.5*/)
);

Material diffuse(in vec3 Kd) {
    return Material(Kd, vec3(0.0, 0.0, 0.0));
}

Material light(in vec3 Ke) {
    return Material(vec3(0.0, 0.0, 0.0), Ke);
}

Ray initRay(in Pixel pixel, in Camera camera) {
    vec3 direction = normalize(vec3(pixel.coordinate.xy, 0.0) - camera.eye);
    return Ray(camera.eye, direction);
}

vec3 getTrianglePointByIndex(int pointIndex) {
    for (int currentPointIndex=0; currentPointIndex<pointsCount; currentPointIndex++) {
        if (currentPointIndex == pointIndex) return meshPoints[currentPointIndex];
    }
    return vec3(-999.0, -999.0, -999.0);
}

float computeSphereIntersection(inout Ray ray, in Sphere sphere) {
    float a = dot(ray.direction, ray.direction);
    float b = 2.0 * dot(ray.direction, ray.origin - sphere.position);
    float c = dot(ray.origin - sphere.position, ray.origin - sphere.position) - sphere.radius * sphere.radius;
    float t = -1.0;
    float delta = b * b - 4.0 * a * c;
    if (delta >= 0.0) {
        float sqrt_delta = sqrt(delta);
        float t1 = (- b - sqrt_delta) / (2.0 * a);
        float t2 = (- b + sqrt_delta) / (2.0 * a);
        float direction = 1.0;
        if (t1 > 0.0) {
            t = t1;
        } else if (t2 > 0.0) {
            t = t2;
            direction = -1.0;
        } else {
            return t;
        }
        ray.origin = ray.origin + t * ray.direction;
        ray.direction = normalize(ray.origin - sphere.position) * direction;
    }
    return t;
}

vec3 triIntersect(in Ray R, in Triangle T) {
    vec3 v1v0 = T.points[1] - T.points[0];
    vec3 v2v0 = T.points[2] - T.points[0];
    vec3 rov0 = R.origin - T.points[0];
    vec3  n = cross(v1v0, v2v0);
    vec3  q = cross(rov0, R.direction);
    float d = 1.0/dot(R.direction, n);
    float u = d*dot(-q, v2v0);
    float v = d*dot(q, v1v0);
    float t = d*dot(-n, rov0);
    if (u<0.0 || v<0.0 || (u+v)>1.0) t = -1.0;
    return vec3(t, u, v);
}

bool segment_box_intersection(
in vec3 q1,
in vec3 dirinv,
in vec3 boxmin,
in vec3 boxmax,
in float t// t of current intersection, used for pruning, see iq's comment.
) {
    // References:
    //    https://tavianator.com/fast-branchless-raybounding-box-intersections/
    vec3 T1 = dirinv*(boxmin - q1);
    vec3 T2 = dirinv*(boxmax - q1);
    vec3 Tmin = min(T1, T2);
    vec3 Tmax = max(T1, T2);
    float tmin = max(max(Tmin.x, Tmin.y), Tmin.z);
    float tmax = min(min(Tmax.x, Tmax.y), Tmax.z);
    return (tmax >= 0.0) && (tmin <= tmax) && (tmin <= t);
}


Triangle triangles[trianglesCount];
Sphere scene[2];
vec3 rayTrace() {

    //Забираем цвет с исходной текстуры
    //Здесь использовать texture2D и uSampler не обязательно, можно просто vec4(0.0,0.0,0.0,0.0)
    vec4 uSampler = vec4(0.0, 0.0, 0.0, 0.0);//texture2D(uSampler, vUvs).rgba;
    //Отразил здесь по x,
    //чтобы совместить координатные оси спрайта на текстуру которого выводится сцена с координатами сцены
    Pixel pixel = Pixel(vec2(vTexCoord.x, vTexCoord.y), uSampler.rgb);

    Ray ray = initRay(pixel, camera);
    Intersection I = intersection();

    scene[0] = Sphere(
    vec3(20.0/*-cos(iTime)*/, 20.0, 25.0/*+sin(iTime)*10.5*/),
    25.0,
    diffuse(vec3(0.8, 0.0, 0.0))
    );
    scene[1] = Sphere(
    vec3(1.0, 3.5, -3.0),
    0.00,
    light(vec3(1.0, 1.0, 1.0))
    );

    Material material;
    float ray_length = computeSphereIntersection(ray, scene[0]);

    if (ray_length > 0.0 && ray_length < infini) {
        material = scene[0].material;

        if (material.Ke != vec3(0.0, 0.0, 0.0)) {
            pixel.color = scene[0].material.Ke;
        } else {
            vec3 result = vec3(0.0, 0.0, 0.0);
            for (int i=0; i<2; ++i) {
                //Для всех сфер являющихся источниками света
                if (scene[i].material.Ke != vec3(0.0, 0.0, 0.0)) {
                    vec3 E = scene[i].position - ray.origin;
                    float lamb = max(0.0, dot(E, ray.direction) / length(E));
                    result += lamb * material.Kd * scene[i].material.Ke;
                }
            }
            pixel.color = result;
        }
    } else {
        //Здесь нужно пересмотреть проверку, а то так сфера всегда на переднем плане получается

        /*for (int triangleIndex=0; triangleIndex<trianglesCount; ++triangleIndex) {
            triangles[triangleIndex].material = Material(vec3(1.0, 1.0, 1.0), vec3(0.0,0.8,0.0));
            vec3 c = meshPoints[triangleIndex];
            for (int trianglePointIndex=0; trianglePointIndex<3;++trianglePointIndex) {
                triangles[triangleIndex].points[trianglePointIndex] = getTrianglePointByIndex(meshTrianglesData[triangleIndex*3+trianglePointIndex]);
            }

            //vec3 invDir = vec3(1.0/ray.direction.x, 1.0/ray.direction.y, 1.0/ray.direction.z);
            //AABB bbox;
            //bbox = AABB(
            //vec3(
            //min(min(triangles[triangleIndex].points[0].x, triangles[triangleIndex].points[1].x), triangles[triangleIndex].points[2].x),
            //min(min(triangles[triangleIndex].points[0].y, triangles[triangleIndex].points[1].y), triangles[triangleIndex].points[2].y),
            //min(min(triangles[triangleIndex].points[0].z, triangles[triangleIndex].points[1].z), triangles[triangleIndex].points[2].z)
            //),
            //vec3(
            //max(max(triangles[triangleIndex].points[0].x, triangles[triangleIndex].points[1].x), triangles[triangleIndex].points[2].x),
            //max(max(triangles[triangleIndex].points[0].y, triangles[triangleIndex].points[1].y), triangles[triangleIndex].points[2].y),
            //max(max(triangles[triangleIndex].points[0].z, triangles[triangleIndex].points[1].z), triangles[triangleIndex].points[2].z)
            //));
            //if (segment_box_intersection(ray.origin, invDir, bbox.min, bbox.max, I.t)){
            vec3 tuv=triIntersect(ray, triangles[triangleIndex]);

            float t2 = tuv.x;
            if (t2>0.0) {
                pixel.color = triangles[triangleIndex].material.Ke;
            } else {
                //Цвет AABB
                //pixel.color += vec3(0.4, 0.4, 0.6);
            }
            //}
        }*/

        pixel.color = vec3(0.0, 0.0, 1.0);
    }
    if (
    //Мы совмещали оси и отразили координату при создании pixel, поэтому отразим и iMouse.x
    floor(pixel.coordinate.x*iScaleWidth)==floor(-iMouse.x) &&
    floor(pixel.coordinate.y*iScaleHeight)==floor(iMouse.y)
    ) {
        pixel.color = vec3(0.0, 0.0, 1.0);
    }
    /*if (pixel.coordinate.x > 20.5) {
        pixel.color = vec3(0.0, 0.0, 1.0);
    } else {
        pixel.color = vec3(1.0, 0.0, 0.0);
    }*/
    return pixel.color;
}
void main(void) {
    gl_FragColor = vec4(rayTrace(), 1.0);
}