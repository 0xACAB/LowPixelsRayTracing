#version 300 es
precision lowp float;
in vec2 v_texcoord;
out vec4 outColor;

uniform float iTime;
uniform vec2 iMouse;
uniform float iScaleWidth;
uniform float iScaleHeight;
#define trianglesCount 10
uniform vec3 trianglesPoints[trianglesCount*3];

vec3 trianglesColors[trianglesCount] = vec3[](
//Cornell box
//A white back wall
vec3(1.0, 1.0, 1.0),
vec3(1.0, 1.0, 1.0),

//A green right wall
vec3(0.0, 1.0, 0.0),
vec3(0.0, 1.0, 0.0),

//A red left wall
vec3(1.0, 0.0, 0.0),
vec3(1.0, 0.0, 0.0),

//A white floor
//top
vec3(1.0, 1.0, 1.0),
vec3(1.0, 1.0, 1.0),

//bottom
vec3(1.0, 1.0, 1.0),
vec3(1.0, 1.0, 1.0)
);

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

        t = (-b-sqrt(delta)) / (2.0*a);
        /*ray.origin = ray.origin + t * ray.direction;
        ray.direction = normalize(ray.origin - sphere.position) * direction;*/
    }
    return t;
}

bool intersect_sphere(in Ray ray, in Sphere sphere, out float t) {
    vec3 CO = ray.origin - sphere.position;
    float a = dot(ray.direction, ray.direction);
    float b = 2.0*dot(ray.direction, CO);
    float c = dot(CO, CO) - sphere.radius*sphere.radius;
    float delta = b*b - 4.0*a*c;
    if (delta < 0.0) {
        return false;
    }
    t = (-b-sqrt(delta)) / (2.0*a);
    return true;
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

Camera camera = Camera(vec3(0.0, 0.0, -25.0));
AABB bbox = AABB(vec3(-1.5, -1.5, 50.0), vec3(1.5, 1.5, 30.0));
Sphere scene[3];
vec3 rayTrace() {
    //Отразил здесь по y,
    //чтобы совместить координатные оси спрайта на текстуру которого выводится сцена с координатами сцены
    Pixel pixel = Pixel(vec2(v_texcoord.x, -v_texcoord.y), vec3(0.0, 0.0, 0.0));

    //camera.eye.z = -25.0+10.5*sin(iTime);
    camera.eye.x = sin(iTime)*2.2;
    Ray ray = initRay(pixel, camera);
    Intersection I = intersection();

    scene = Sphere[3](
    Sphere(vec3(0.0, 0.0, 40.0), 0.75, diffuse(vec3(0.8, cos(iTime), sin(iTime)))),
    Sphere(vec3(1.0*sin(iTime), 0.0, 40.0+1.0*cos(iTime)), 0.25, diffuse(vec3(0.6, 0.6, 0.6))),
    Sphere(vec3(0.0, 3.5, -3.0), 0.00, light(vec3(1.0, 1.0, 1.0)))
    );

    Material material;

    vec3 invDir = vec3(1.0/ray.direction.x, 1.0/ray.direction.y, 1.0/ray.direction.z);
    float ray_length = infini;
    if (segment_box_intersection(ray.origin, invDir, bbox.min, bbox.max, I.t)) {

        //Только если прошли ограничение считаем пересечения с треугольниками
        for (int triangleIndex=0; triangleIndex<trianglesCount; ++triangleIndex) {
            Triangle triangle = Triangle(
            vec3[](
            trianglesPoints[triangleIndex*3],
            trianglesPoints[triangleIndex*3+1],
            trianglesPoints[triangleIndex*3+2]
            ),
            Material(vec3(1.0, 1.0, 1.0), trianglesColors[triangleIndex])
            );
            vec3 tuv=triIntersect(ray, triangle);
            float t2 = tuv.x;
            if (t2>0.0) {
                if (t2<ray_length){
                    pixel.color = triangle.material.Ke;
                }
                ray_length = t2;
            } else {
                //Цвет AABB
                //pixel.color += vec3(0.4, 0.4, 0.6);
            }
        }
    }
    for (int i=0; i<scene.length(); ++i) {
        float ray_length2 = computeSphereIntersection(ray, scene[i]);
        if (ray_length2 > 0.0 && ray_length2 < ray_length) {
            ray_length = ray_length2;
            material = scene[i].material;
            if (material.Ke != vec3(0.0, 0.0, 0.0)) {
                pixel.color = scene[i].material.Ke;
            } else {
                vec3 result = vec3(0.0, 0.0, 0.0);
                for (int i=0; i<scene.length(); ++i) {
                    //Для всех сфер являющихся источниками света
                    if (scene[i].material.Ke != vec3(0.0, 0.0, 0.0)) {
                        vec3 E = scene[i].position - ray.origin;
                        float lamb = max(0.0, dot(E, ray.direction) / length(E));
                        result += lamb * material.Kd * scene[i].material.Ke;
                    }
                }
                pixel.color = result;
            }
        }
    };
    /*for(int i=0; i<scene.length(); ++i) {
        material = scene[i].material;
        if (material.Ke != vec3(0.0, 0.0, 0.0)) {
            pixel.color = scene[i].material.Ke;
        } else {
            vec3 result = vec3(0.0, 0.0, 0.0);
            //Для всех сфер являющихся источниками света
            if (scene[i].material.Ke != vec3(0.0, 0.0, 0.0)) {
                vec3 E = scene[i].position - ray.origin;
                float lamb = max(0.0, dot(E, ray.direction) / length(E));
                result += lamb * material.Kd * scene[i].material.Ke;
            }
            pixel.color = result;
        }
    }*/
    /*if (
    //Мы совмещали оси и отразили координату при создании pixel, поэтому отразим и iMouse.x
    floor(pixel.coordinate.x*iScaleWidth)==floor(-iMouse.x) &&
    floor(pixel.coordinate.y*iScaleHeight)==floor(iMouse.y)
    ) {
        pixel.color = vec3(0.0, 0.0, 1.0);
    }*/
    /*if (pixel.coordinate.x > .65) {
        pixel.color = vec3(0.0, 0.0, 1.0);
    } else {
        pixel.color = vec3(1.0, 0.0, 0.0);
    }*/
    return pixel.color;
}
void main(void) {
    outColor = vec4(rayTrace(), 1.0);
}