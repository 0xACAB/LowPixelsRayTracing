export let frag = `
        varying vec3 vUvs;

        uniform sampler2D uSampler;
        uniform float iTime;
        uniform vec2 iMouse;

        const float infini = 1.0 / 0.0;


        struct Pixel {
            vec2 coordinate;
            vec3 color;
        };

        struct Sphere {
            vec3 position;
            float radius;
        };

        struct Camera {
            vec3 eye;
        };

        struct Ray {
            vec3 origin;
            vec3 direction;
        };

        struct Material {
            vec3 Kd; // diffuse color
            vec3 Ke; // emissive color
        };
        
        struct Intersection {
           float t;
           Material material;
           vec3 P;
           vec3 N;
        };
        
        Intersection intersection() {
           Intersection I;
           I.t = infini;
           return I;
        }
        
        Camera camera = Camera(
            vec3(0.0, 0.0, -1.0)
        );

        Material diffuse(in vec3 Kd) {
           return Material(Kd, vec3(0.0, 0.0, 0.0));
        }

        Material light(in vec3 Ke) {
           return Material(vec3(0.0, 0.0, 0.0), Ke);
        }

        Ray initRay(in Pixel pixel, in Camera camera) {
            vec3 direction = normalize(vec3(pixel.coordinate.xy,0.0) - camera.eye);
            return Ray(
                camera.eye,
                direction
            );
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

        bool intersect_triangle(
            in Ray R, in vec3 A, in vec3 B, in vec3 C, out float t, 
            out float u, out float v, out vec3 N
        ) { 
           // Möller et Trumbore, « Fast, Minimum Storage Ray-Triangle Intersection »
           vec3 E1 = B-A;
           vec3 E2 = C-A;
                 N = cross(E1,E2);
           float det = -dot(R.direction, N);
           float invdet = 1.0/det;
           vec3 AO  = R.origin - A;
           vec3 DAO = cross(AO, R.direction);
           u =  dot(E2,DAO) * invdet;
           v = -dot(E1,DAO) * invdet;
           t =  dot(AO,N)  * invdet; 
           return (det >= 1e-6 && t >= 0.0 && u >= 0.0 && v >= 0.0 && (u+v) <= 1.0);
        }
        
        
        struct Object {
           Sphere sphere;
           Material material;
        };
        
        Object scene[2];

        vec3 rayTrace() {
            //Забираем цвет с исходной текстуры
            vec4 uSampler = texture2D(uSampler, vUvs.xy).rgba;

            Pixel pixel = Pixel(
                vUvs.xy,
                uSampler.rgb
            );

            Ray ray = initRay(pixel, camera);
            Intersection I = intersection();
            
            //iMouse.x
            scene[0] = Object(
              Sphere(vec3(0.5+sin(iTime) * 0.25, 0.5+cos(iTime) * 0.25, 1.0),0.3),
              diffuse(vec3(1.0, 1.0, 1.0))
            );

            scene[1] = Object(
              Sphere(vec3(1.0, 3.5, -3.0), 0.00),
              light(vec3(1.0, 1.0, 1.0))
            );

            Material material;
            float ray_length = computeSphereIntersection(ray, scene[0].sphere);
            if (ray_length > 0.0 && ray_length < infini) {
                material = scene[0].material;

                if(material.Ke != vec3(0.0, 0.0, 0.0)) {
                    pixel.color = scene[0].material.Ke;
                } else {
                    vec3 result = vec3(0.0, 0.0, 0.0);
                    for(int i=0; i<2; ++i) {
                        //Для всех сфер являющихся источниками света
                        if(scene[i].material.Ke != vec3(0.0, 0.0, 0.0)) {
                            vec3 E = scene[i].sphere.position - ray.origin;
                            float lamb = max(0.0, dot(E,ray.direction) / length(E));
                            result += lamb * material.Kd * scene[i].material.Ke;
                        }
                   }
                   pixel.color = result;
                }
            } else {
                float t,u,v;                
                vec3 N;
                //Важен путь обхода вершин!
                if (intersect_triangle(ray, vec3(4.0+sin(iTime),0.0,3.0),vec3(1.0,3.0,3.0),  vec3(7.0,3.0,3.0), t, u, v, N) ) {
                   pixel.color = vec3(1.0,1.0,1.0);
                }
            }

            if (
                floor(pixel.coordinate.x*20.0)==floor(iMouse.x) &&
                floor(pixel.coordinate.y*20.0)==floor(iMouse.y)
             ) {
                pixel.color = vec3(1.0, 0.0, 0.0);
            }
            return pixel.color;
        }

        void main(void) {
            gl_FragColor = vec4(rayTrace(), 1.0);
        }
    `;