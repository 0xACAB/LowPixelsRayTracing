import { Application, Assets, Container, TextStyle, Text } from 'pixi.js';
import { TextureSwitcher } from './widgets/textureSwitcher';

let onload = function() {
    const app = new Application({
        width: 800,
        height: 600,
        backgroundColor: 0xFFE1B5,
        antialias: true,
    });
    document.body.querySelector('#app').appendChild(app.view);

    async function init() {
        // manifest example
        const manifest = {
            bundles: [
                /*{
                    name: 'load-screen',
                    assets: [
                        {
                            name: 'flowerTop',
                            srcs: 'examples/assets/flowerTop.png',
                        },
                    ],
                },*/
                {
                    name: 'game-screen',
                    assets: [
                        {
                            name: 'on_tumbler',
                            srcs: 'assets/on_tumbler.png',
                        },
                        {
                            name: 'off_tumbler',
                            srcs: 'assets/off_tumbler.png',
                        },
                    ],
                },
            ],
        };

        await Assets.init({ manifest });
        // bundles can be loaded in the background too!
        await Assets.backgroundLoadBundle([/*'load-screen',*/ 'game-screen']);

        await makeGameScreen();
    }

    async function makeGameScreen() {
        // Wait here until you get the assets
        // If the user spends enough time in the load screen by the time they reach the game screen
        // the assets are completely loaded and the promise resolves instantly!
        const loadScreenAssets = await Assets.loadBundle('game-screen');

        let container = new Container();
        app.stage.addChild(container);

        // create a new Sprite from the resolved loaded texture
        /*const Telegram_2019_Logo = new Sprite(loadScreenAssets.Telegram_2019_Logo);
        Telegram_2019_Logo.position.set(40, 50);
        Telegram_2019_Logo.anchor.set(0.5);
        Telegram_2019_Logo.scale.set(0.33);
        container.addChild(Telegram_2019_Logo);*/

        const style = new TextStyle({
            fontSize: 20,
            fontFamily: 'Arial, Helvetica, sans-serif',
        });
        const text = new Text('@xTrancendence', style);
        text.position.set(75, 50);
        text.anchor.set(0, 0.5);
        text.interactive = true;
        text.cursor = 'pointer';
        text.on('pointertap', function(event) {
            window.open('https://t.me/xTranscendence', '__blank');
        });
        container.addChild(text);

        let textureSwitcher = new TextureSwitcher({
            container,
            scales: [
                { width: 40*2, height: 20*2},
                { width: 800, height: 400 }
            ]
        });
        textureSwitcher.app = app;
        app.ticker.add(() => {
            textureSwitcher.update(app);
        });
        app.ticker.start();}

    init();
};
window.onload = onload;