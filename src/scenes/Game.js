import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    create() {
        console.log('Game: create');

        this.cameras.main.setBackgroundColor(0x00ff00);
        this.add.image(512, 384, 'background').setAlpha(0.5);

        // Afegir una imatge sobre el fons
        this.add.image(512, 384, 'foregroundImage'); // Canvia 'foregroundImage' pel nom de la teva imatge

        // Crear grup de plataformes
        this.platforms = this.physics.add.staticGroup();

        // Crear el terra
        this.ground = this.platforms.create(512, 770, 'ground').setScale(10, 0.1).refreshBody();
        this.ground.displayWidth = 1024;
        this.ground.displayHeight = 35;
        this.ground.setOrigin(0.5, 1);
        this.ground.setVisible(true);

        // Crear el jugador i fer-lo més petit
        this.player = this.physics.add.image(512, 660, 'player').setImmovable(true).setScale(0.3);
        this.player.body.allowGravity = false;

        // Habilitar control del teclat
        this.cursors = this.input.keyboard.createCursorKeys();

        // Crear grup de pilotes, bombes i vides
        this.balls = this.physics.add.group();
        this.bombs = this.physics.add.group();
        this.lives = this.physics.add.group();

        // Afegir col·lisions
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.balls, this.player, this.catchBall, null, this);
        this.physics.add.collider(this.bombs, this.player, this.hitBomb, null, this);
        this.physics.add.collider(this.lives, this.player, this.catchLife, null, this);
        this.physics.add.collider(this.balls, this.platforms, this.hitGround, null, this);
        this.physics.add.collider(this.bombs, this.platforms, this.hitGround, null, this);
        this.physics.add.collider(this.lives, this.platforms, this.hitGround, null, this);

        // Puntuació
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Puntuació: 0', { fontSize: '32px', fill: '#000' });

        // Vides
        this.livesCount = 3;
        this.livesLabel = this.add.text(16, 48, 'Vides:', { fontSize: '32px', fill: '#000' }); // Afegir text "Vides:"
        this.livesIcons = this.add.group();
        this.updateLivesIcons();

        // Temporitzador per generar pilotes, bombes i vides
        this.time.addEvent({
            delay: 1000,
            callback: this.addObject,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        // Moviment del jugador
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-500);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(500);
        } else {
            this.player.setVelocityX(0);
        }

        const groundY = this.ground.y;
        this.balls.children.iterate((child) => {
            if (child.y > groundY) {
                console.log(`Destruint pilota fora del límit en y: ${child.y}`);
                child.destroy();
            }
        });

        this.bombs.children.iterate((child) => {
            if (child.y > groundY) {
                console.log(`Destruint bomba fora del límit en y: ${child.y}`);
                child.destroy();
            }
        });

        this.lives.children.iterate((child) => {
            if (child.y > groundY) {
                console.log(`Destruint vida fora del límit en y: ${child.y}`);
                child.destroy();
            }
        });
    }

    catchBall(player, ball) {
        ball.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Puntuació: ' + this.score);
    }

    hitBomb(player, bomb) {
        bomb.disableBody(true, true);
        this.livesCount -= 1;
        this.updateLivesIcons();

        if (this.livesCount <= 0) {
            this.scene.start('GameOver');
        }
    }

    catchLife(player, life) {
        life.disableBody(true, true);
        this.livesCount += 1;
        this.updateLivesIcons();
    }

    hitGround(object, platforms) {
        console.log(`Objecte col·lisionat amb el terra en x: ${object.x}, y: ${object.y}`);
        object.destroy();
    }

    addObject() {
        const x = Phaser.Math.Between(0, 1024);
        const type = Phaser.Math.Between(0, 99); // Ajustar la probabilitat d'aparició

        if (type < 50) { // 50% de probabilitat que aparegui una pilota
            const ball = this.balls.create(x, 0, 'ball');
            ball.setScale(0.1);
            ball.setBounce(0);
            ball.setCollideWorldBounds(true);
            ball.setVelocityY(200);
            console.log(`Pilota creada en x: ${x}, y: ${ball.y}`);
        } else if (type < 95) { // 45% de probabilitat que aparegui una bomba
            const bomb = this.bombs.create(x, 0, 'bomb');
            bomb.setScale(0.1);
            bomb.setBounce(0);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocityY(200);
            console.log(`Bomba creada en x: ${x}, y: ${bomb.y}`);
        } else { // 5% de probabilitat que aparegui una vida
            const life = this.lives.create(x, 0, 'life');
            life.setScale(0.05); // Més petita que les altres
            life.setBounce(0);
            life.setCollideWorldBounds(true);
            life.setVelocityY(300); // Les vides cauen més ràpid
            console.log(`Vida creada en x: ${x}, y: ${life.y}`);
        }
    }

    updateLivesIcons() {
        // Eliminar icones existents
        this.livesIcons.clear(true, true);

        // Afegir noves icones segons el nombre de vides
        const startX = this.livesLabel.x + this.livesLabel.width + 10; // Iniciar després del text "Vides:"
        for (let i = 0; i < this.livesCount; i++) {
            this.livesIcons.create(startX + i * 30, 64, 'lifeIcon').setScale(0.1); // Ajustar la mida i espai entre icones de vida
        }
    }
}