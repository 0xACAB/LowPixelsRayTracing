#version 300 es
precision lowp float;
in vec2 v_texcoord;
out vec4 outColor;

uniform float iTime;
uniform vec2 iMouse;
uniform float iScaleWidth;
uniform float iScaleHeight;

#define trianglesCount 1
#define pointsCount 8
uniform vec3 trianglesPoints[pointsCount];
uniform ivec3 trianglesData[trianglesCount];
uniform vec3 trianglesColors[trianglesCount];

const float FARAWAY=1e30;
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

struct Triangle {
    vec3 points[3];
    Material material;
};

struct Scene {
    Triangle triangle;
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
    I.t = FARAWAY;
    return I;
}

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

Scene scene;
void init_scene() {
    scene = Scene(Triangle(
    vec3[](
    trianglesPoints[trianglesData[0][0]],
    trianglesPoints[trianglesData[0][1]],
    trianglesPoints[trianglesData[0][2]]
    ),
    Material(vec3(1.0, 1.0, 1.0), trianglesColors[0])
    ));
}
Camera camera = Camera(vec3(0.0, 0.0, 2.0));
AABB bbox = AABB(vec3(-1.5, -1.5, -50.0), vec3(1.5, 1.5, -30.0));


vec3 rayTrace() {
    //Отразил здесь по y,
    /*//чтобы совместить координатные оси спрайта на текстуру которого выводится сцена с координатами сцены
    Pixel pixel = Pixel(vec2(v_texcoord.x, -v_texcoord.y), vec3(0.0, 0.0, 1.0));*/

    Pixel pixel = Pixel(vec2(v_texcoord.x, v_texcoord.y), vec3(0.0, 0.0, 1.0));

    //camera.eye.z = -25.0+10.5*sin(iTime);
    camera.eye.x = 0.0;//sin(iTime)*2.2;
    //camera.eye.y = cos(iTime)*1.2;
    Ray ray = initRay(pixel, camera);
    Intersection I = intersection();

    vec3 invDir = vec3(1.0/ray.direction.x, 1.0/ray.direction.y, 1.0/ray.direction.z);
    float ray_length = FARAWAY;
    //if (segment_box_intersection(ray.origin, invDir, bbox.min, bbox.max, I.t)) {
    //Только если прошли ограничение считаем пересечения с треугольником
    vec3 tuv=triIntersect(ray, scene.triangle);
    float t2 = tuv.x;
    if (t2>0.0) {
        if (t2<ray_length){
            pixel.color = scene.triangle.material.Ke;
        }
        ray_length = t2;
    } else {
        //Цвет AABB
        //pixel.color += vec3(0.4, 0.4, 0.6);
    }
    //}

    //Делим на 2 по причине того что 0 в середине и расстояние от 0 до 1 равно половине ширины и высоты текстуры
    if (
    (floor(pixel.coordinate.x*(iScaleWidth/2.0))==iMouse.x) &&
    (floor(pixel.coordinate.y*(iScaleHeight/2.0))==iMouse.y)
    ) {
        pixel.color = vec3(1.0, 0.0, 0.0);
    }
    /*if (
    ((pixel.coordinate.x*8.0)>floor(iMouse.x)) &&
    ((pixel.coordinate.x*8.0)<ceil(iMouse.x))
    ) {
        pixel.color = vec3(1.0, 0.0, 0.0);
    }*/
    return pixel.color;
}
void main(void) {
    init_scene();
    outColor = vec4(rayTrace(), 1.0);
}