import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        console.log('Boot: preload');
        this.load.image('background', 'assets/bg.png');
    }

    create() {
        console.log('Boot: create');
        this.scene.start('Preloader');
    }
}
