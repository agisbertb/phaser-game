import { Scene } from 'phaser';

export class GameOver extends Scene {
    constructor() {
        super('GameOver');
    }

    create() {
        // Afegir la imatge del "Game Over" i ajustar la seva mida
        this.add.image(512, 384, 'gameOverImage'); // Ajustar la mida segons sigui necessari

        // Afegir botó per reiniciar el joc
        const restartButton = this.add.image(535, 400, 'restartButton').setInteractive();
        restartButton.on('pointerdown', () => this.scene.start('Game'));

        // Afegir botó per tornar al menú
        const menuButton = this.add.image(535, 500, 'menuButton').setInteractive();
        menuButton.on('pointerdown', () => this.scene.start('MainMenu'));

        // Detectar quan es prem la tecla SPACE per reiniciar el joc
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('Game');
        });

        // Detectar quan es prem la tecla M per tornar al menú
        this.input.keyboard.once('keydown-M', () => {
            this.scene.start('MainMenu');
        });
    }
}
