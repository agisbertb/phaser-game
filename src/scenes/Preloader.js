import { Scene } from 'phaser';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        this.add.image(512, 384, 'background');
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);
        this.load.on('progress', (progress) => {
            bar.width = 4 + (460 * progress);
        });
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('logo', 'logo.png');
        this.load.image('player', 'basket.png');
        this.load.image('ball', 'object.png'); 
        this.load.image('ground', 'ground.png');
        this.load.image('bomb', 'bomb.png');
        this.load.image('life', 'life.png');
        this.load.image('lifeIcon', 'lifeIcon.png');
        this.load.image('foregroundImage', 'foregroundImage.png');
        this.load.image('gameOverImage', 'gameOver.png');
        this.load.image('restartButton', 'restart.png');
        this.load.image('menuButton', 'menu.png');
        this.load.image('mainMenuBackground', 'mainMenuBackground.png');
        this.load.image('playButton', 'playButton.png');
    }

    create() {
        this.scene.start('MainMenu');
    }
}
