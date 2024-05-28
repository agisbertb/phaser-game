import { Scene } from 'phaser';

export class GameOver extends Scene {
    constructor() {
        super('GameOver');
    }

    create() {
        this.add.image(512, 384, 'gameOverImage')

        this.gameOverMusic = this.sound.add('gameOverMusic', { loop: true });
        this.gameOverMusic.play();

        if (this.backgroundMusic) {
            this.backgroundMusic.stop();
        }

        const restartButton = this.add.image(535, 400, 'restartButton').setInteractive();
        restartButton.on('pointerdown', () => {
            this.gameOverMusic.stop();
            this.scene.start('Game');
        });

        const menuButton = this.add.image(535, 500, 'menuButton').setInteractive();
        menuButton.on('pointerdown', () => {
            this.gameOverMusic.stop();
            this.scene.start('MainMenu');
        });

        this.input.keyboard.once('keydown-SPACE', () => {
            this.gameOverMusic.stop();
            this.scene.start('Game');
        });

        this.input.keyboard.once('keydown-M', () => {
            this.gameOverMusic.stop();
            this.scene.start('MainMenu');
        });
    }
}
