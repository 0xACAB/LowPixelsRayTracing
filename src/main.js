import Cards from './cards';
import * as PIXI from 'pixi.js';
import { Application } from '@pixi/app';
import { InteractionManager } from '@pixi/interaction';

const init = () => {
    const app = new Application({
        width: 800,
        height: 600,
        backgroundColor: 0xFFE1B5,
        antialias: true,
    });
    app.renderer.plugins.interaction = new InteractionManager(app.stage, app.view);

    let container = new PIXI.Container();
    container.interactive = true;
    app.stage.addChild(container);

    const style = new PIXI.TextStyle({
        fontSize: 20,
        fontFamily: 'Arial, Helvetica, sans-serif',
    });
    const text = new PIXI.Text('Hello World', style);
    container.addChild(text);
    /*Матрицы используются для определения местонахождения квадрата, где рендерится
    * в частности поэтому aVertexPosition имеет тип vec2
    * */
    const vert = `
        attribute vec2 aVertexPosition;
        attribute vec3 aUvs;
        
        uniform mat3 translationMatrix;
        uniform mat3 projectionMatrix;
        
        varying vec3 vUvs;
        
        void main(void) {
            vUvs = aUvs;
            gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
        }
    `;

    const frag = `
        varying vec3 vUvs;
        
        #define STEPS 40
        #define LIGHTPASSES 1
        

        uniform sampler2D uSampler;
        uniform float iTime;
        uniform vec2 iMouse;
       
        const vec3 wallColor = vec3(1.0,1.0,1.0);
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
        Camera camera = Camera(
            vec3(0.5, 0.5,  -5.0)
        );
        
        struct Material {
            vec3 Kd; // diffuse color
            vec3 Ke; // emissive color
        };
        
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
        
        struct Object {
           Sphere sphere;
           Material material;
        };
        
        Object scene[2];
        
        vec3 rayTrace(vec2 fCord) {            
            //Забираем цвет с исходной текстуры
            vec4 uSampler = texture2D(uSampler, vUvs.xy).rgba;
            
            Pixel pixel = Pixel(
                vUvs.xy,
                uSampler.rgb                                                             
            );
           
            Ray ray = initRay(pixel, camera);
            
            scene[0] = Object(
              Sphere(vec3(iMouse.x+sin(iTime) * 0.5, iMouse.y+cos(iTime) * 0.5, 1.0),0.2), 
              diffuse(vec3(1.0, 1.0, 1.0))
            );
            
            scene[1] = Object(
              Sphere(vec3(5.0, 0.0, -3.0),0.02),
              light(vec3(1.0, 1.0, 1.0)) 
            );
           
            Material material; // Couleur
            float ray_length = computeSphereIntersection(ray, scene[0].sphere);
            if (ray_length > 0.0 && ray_length < infini) {
                material = scene[0].material;
                
                if(material.Ke != vec3(0.0, 0.0, 0.0)) {
                    pixel.color = scene[0].material.Ke;
                } else {
                    vec3 result = vec3(0.0, 0.0, 0.0);
                    for(int i=0; i<2; ++i) {
                        if(scene[i].material.Ke != vec3(0.0, 0.0, 0.0)) {
                            Ray R2 = Ray(ray.origin, scene[i].sphere.position);
                            vec3 E = scene[i].sphere.position - ray.origin;
                            float lamb = max(0.0, dot(E,ray.direction) / length(E));
                            result += lamb * material.Kd * scene[i].material.Ke;
                        }
                   }
                   pixel.color = result;
                }
            }
            return pixel.color;
        }
        
        void main(void) {
            gl_FragColor = vec4(rayTrace(vUvs.xy), 1.0);
        }
    `;

    let buff = new Uint8Array(20 * 20 * 4);
    buff.forEach((_, bufferIndex) => {
        //RGBA
        [0, 0, 255, 255].forEach((colorChannel, colorChannelIndex) => {
            buff[bufferIndex * 4 + colorChannelIndex] = colorChannel;
        });
    });

    let texture = PIXI.Texture.fromBuffer(/*buff*/null, 20, 20);
    const material = new PIXI.MeshMaterial(texture, {
        program: PIXI.Program.from(vert, frag),
        uniforms: {
            light: [0.4, 0.5, -0.6],
            iTime: 0,
            iMouse: [0, 0],
        },
    });
    const geometry = new PIXI.Geometry()
        .addAttribute('aVertexPosition',
            [
                0, 0,
                20, 0,
                20, 20,
                0, 20,
            ])
        .addAttribute('aUvs',
            [
                0, 0, 0,
                1, 0, 0,
                1, 1, 0,
                0, 1, 0,
            ])
        .addIndex([0, 1, 2, 0, 2, 3]);

    const mesh = new PIXI.Mesh(geometry, material);
    mesh.position.set(0, 0);

    const baseRenderTexture = new PIXI.BaseRenderTexture({
        width: 20,
        height: 20,
        scaleMode: PIXI.SCALE_MODES.NEAREST,

    });
    const renderTexture = new PIXI.RenderTexture(baseRenderTexture);
    const sprite = new PIXI.Sprite(renderTexture);
    sprite.anchor.set(0.5, 0.5);
    sprite.position.set(300, 300);
    sprite.scale.set(20, 20);

    let mouse = {
        x: 10,
        y: 10,
    };
    sprite.interactive = true;
    sprite.buttonMode = true;
    sprite.on('pointertap', function(event) {
        console.log('PointerTap event');
        mouse.x = event.data.getLocalPosition(event.currentTarget).x + 10;
        mouse.y = event.data.getLocalPosition(event.currentTarget).y + 10;
        console.log('X', mouse.x, 'Y', mouse.y);
    });
    container.addChild(sprite);
    document.body.querySelector('#root').appendChild(app.view);
    app.ticker.add(() => {
        Cards.time = app.ticker.lastTime;
        sprite;
        mesh.shader.uniforms.iTime = app.ticker.lastTime / 1000;
        mesh.shader.uniforms.iMouse = [mouse.x / 20, mouse.y / 20];
        app.renderer.render(mesh, { renderTexture });
        /*text.text = ' time: ' + Cards.time + '\n Кликай на тёмное поле!';*/
    });
    app.ticker.start();

};
window.onload = init;