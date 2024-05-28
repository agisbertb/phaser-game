import { Scene } from 'phaser';

export class MainMenu extends Scene {
    constructor() {
        super('MainMenu');
    }

    create() {
        // Agregar la imagen de fondo del menú principal
        this.add.image(512, 384, 'mainMenuBackground');

        // Agregar el botón de "Jugar"
        const playButton = this.add.image(512, 500, 'playButton').setInteractive();
        playButton.on('pointerdown', () => this.scene.start('Game'));
    }
}
