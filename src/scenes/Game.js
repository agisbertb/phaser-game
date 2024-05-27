import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    create() {
        console.log('Game: create');

        this.cameras.main.setBackgroundColor(0x00ff00);
        this.add.image(512, 384, 'background').setAlpha(0.5);

        // Crea grup de plataformes
        this.platforms = this.physics.add.staticGroup();

        // Crea el sostre
        this.ground = this.platforms.create(512, 770, 'ground').setScale(10, 0.1).refreshBody();
        this.ground.displayWidth = 2048;
        this.ground.displayHeight = 64;
        this.ground.setOrigin(0.5, 1);
        this.ground.setVisible(true); 

        // Crea el ninot de el fa més petit
        this.basket = this.physics.add.image(512, 660, 'basket').setImmovable().setScale(0.3);
        this.basket.body.allowGravity = false;

        // Habilitar el control pel teclat
        this.cursors = this.input.keyboard.createCursorKeys();

        // Crea grup d'objectes que cauen
        this.objects = this.physics.add.group({
            key: 'object',
            repeat: 5,
            setXY: { x: 12, y: 0, stepX: 200 },
            setScale: { x: 0.1, y: 0.1 }
        });

        this.objects.children.iterate((child) => {
            child.setBounce(0);
            child.setCollideWorldBounds(true);
            child.setVelocityY(200); // Asegurarse de que los objetos caen
        });
    
        console.log(`Ground position: x=${this.ground.x}, y=${this.ground.y}`);
        console.log(`Ground size: width=${this.ground.displayWidth}, height=${this.ground.displayHeight}`);

        // Colisions
        this.physics.add.collider(this.basket, this.platforms);
        this.physics.add.collider(this.objects, this.basket, this.catchObject, null, this);
        this.physics.add.collider(this.objects, this.platforms, this.hitGround, null, this);

        // Puntuació
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

        // Temporitzador per generar balons
        this.time.addEvent({
            delay: 1000,
            callback: this.addObject,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        // Moviment del ninot
        if (this.cursors.left.isDown) {
            this.basket.setVelocityX(-500);
        } else if (this.cursors.right.isDown) {
            this.basket.setVelocityX(500);
        } else {
            this.basket.setVelocityX(0);
        }

        const groundY = this.ground.y;
        this.objects.children.iterate((child) => {
            if (child.y > groundY) {
                console.log(`Destruyendo objeto fuera del límite en y: ${child.y}`); // Registro para depuración
                child.destroy();
            }
        });

    }

    catchObject(basket, object) {
        object.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
    }

    hitGround(object,platforms) {
        console.log(`Objeto colisionó con el suelo en x: ${object.x}, y: ${object.y}`); // Registro para depuración
        object.destroy();

    }

    addObject() {
        const x = Phaser.Math.Between(0, 1024);
        const object = this.objects.create(x, 0, 'object');
        object.setScale(0.1); // Asegurarse de que los objetos se escalen correctamente
        object.setBounce(0); // Evitar que reboten
        object.setCollideWorldBounds(true);
        object.setVelocityY(200); // Asegurarse de que los objetos caen
        console.log(`Objeto creado en x: ${x}, y: ${object.y}`); // Registro para depuración
    }
}