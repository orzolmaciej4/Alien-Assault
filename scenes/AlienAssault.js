const gameState = {
    enemyVelocity: 1.5,
    lives: 3,
    wave: 1,
    bossVelocity: 2.5,
    bossHealth: 10,
};

function preload() {
    this.load.image('enemy1', 'Assets/images/enemy1.png');
    this.load.image('enemy2', 'Assets/images/enemy2.png');
    this.load.image('enemy3', 'Assets/images/enemy3.png');
    this.load.image('background', 'Assets/images/background2.jpg');
    this.load.image('platform', 'Assets/images/platform.png');
    this.load.image('block', 'Assets/images/block.png')
    this.load.image('character', 'Assets/images/character.png');
    this.load.image('eBullet', 'Assets/images/eBullet.png');
    this.load.image('pBullet', 'Assets/images/pBullet.png');
    this.load.image('boss', 'Assets/images/newboss.png');
  
    this.load.audio('song', ['assets/sounds/main.wav']);
    this.load.audio('hit', ['assets/sounds/enemy_hit.wav']);
    this.load.audio('shoot', ['assets/sounds/shoot.wav']);
    this.load.audio('victory', ['assets/sounds/victory.wav']);
    this.load.audio('game_over', ['assets/sounds/game_over.wav']);
}
  
function create() {
    // When gameState.active is true, the game is being played and not over. When gameState.active is false, then it's game over
    gameState.active = true;
    
    this.add.image(225, 205, 'background');
    this.add.image(525, 210, 'block');
    this.add.text(460, 10, '  Alien \n Assault', {fontSize: '25px', fill: '#fff'});
    this.add.text(460, 120, 'Controls:', {fontSize: '20px', fill: '#fff'}); 
    this.add.text(460, 140, '- Use the \narrow keys \nto move', {fontSize: '17px', fill: '#fff'});
    this.add.text(460, 190, '- Use the \nspacebar \nto shoot', {fontSize: '17px', fill: '#fff'});
    this.add.text(460, 280, 'Your objective \nis to protect \nplanet Earth \nfrom the \nalien invasion', {fontSize: '16px', fill: '#fff'});


    gameState.music = this.sound.add('song');
    gameState.hit = this.sound.add('hit');
    gameState.shoot = this.sound.add('shoot');
    gameState.victory = this.sound.add('victory');
    gameState.lose = this.sound.add('game_over');
    gameState.music.play();

    // When gameState.active is false, the game will listen for a pointerup event and restart when the event happens
    this.input.on('pointerup', () => {
        if (gameState.active === false) {
            this.scene.restart();
        }
    });
    
    gameState.enemyList = ['enemy1', 'enemy2', 'enemy3'];
    gameState.enemies = this.physics.add.group();
    gameState.boss = this.physics.add.group();
    waveGen(1);
    
    // Creating static platforms
    const platforms = this.physics.add.staticGroup();
    platforms.create(225, 410, 'platform').refreshBody();
  
    // Displays the initial number of enemies, initially hardcoded as 8 
    gameState.scoreText = this.add.text(155, 402, `Enemies Left: ${numOfTotalEnemies()}`, styleW);

    //Displays the number of lives the player has
    gameState.livesText = this.add.text(350, 402, `Lives: ${gameState.lives}`, styleW);

    //Displays the wave number
    gameState.waveText = this.add.text(30, 402, `Wave: ${gameState.wave}`, styleW);
  
    // Uses the physics plugin to create Codey
    gameState.player = this.physics.add.sprite(225, 370, 'character').setScale(1.5);
  
    // Create Collider objects
    gameState.player.setCollideWorldBounds(true);
    this.physics.add.collider(gameState.player, platforms);
    
    // Creates cursor objects to be used in update()
    gameState.cursors = this.input.keyboard.createCursorKeys();
  
    gameState.eBullets = this.physics.add.group();
    const geneBullet = () => {
        let randomEnemy = Phaser.Utils.Array.GetRandom(gameState.enemies.getChildren());
        gameState.eBullets.create(randomEnemy.x, randomEnemy.y + 12, 'eBullet').setScale(0.5).setGravityY(150);
    }
    gameState.eBulletsLoop = this.time.addEvent({
        delay: 300/(gameState.wave + 1),
        callback: geneBullet,
        callbackScope: this,
        loop: true,
    });

    this.physics.add.collider(gameState.eBullets, platforms, function(eBullet) {
        eBullet.destroy();
    });
  
    this.physics.add.collider(gameState.eBullets, gameState.player, (player, eBullet) => {
        eBullet.disableBody(true, true);
        gameState.lives--;
        gameState.hit.play();
        gameState.livesText.setText(`Lives: ${gameState.lives}`);
    });
  
    gameState.pBullets = this.physics.add.group();
  
    this.physics.add.collider(gameState.enemies, gameState.pBullets, (enemy, pBullet) => {
        enemy.destroy();
        pBullet.destroy();
        gameState.enemyVelocity *= 1.05;
        gameState.scoreText.setText(`Enemies Left: ${numOfTotalEnemies()}`);
    });
          
    this.physics.add.collider(gameState.enemies, gameState.player, () => {
        gameState.active = false;
        gameState.music.stop();
        gameState.lose.play();
        gameState.eBulletsLoop.destroy();
        this.physics.pause();
        gameState.enemyVelocity = 1;
        gameState.lives = 3;
        gameState.wave = 1;
        this.add.text(157, 160, 'Game Over', {fontSize: '25px', fill: '#fff', stroke: '#000', strokeThickness: 10});
        this.add.text(45, 190, 'You have failed to protect planet Earth \n       from the alien invasion', {fontSize: '16px', fill: '#fff', stroke: '#000', strokeThickness: 5});
        this.add.text(130, 230, 'Click to try again', {fontSize: '18px', fill: '#fff', stroke: '#000', strokeThickness: 5});
    });

    this.physics.add.collider(gameState.enemies, platforms, () => {
        gameState.active = false;
        gameState.music.stop();
        gameState.lose.play();
        gameState.eBulletsLoop.destroy();
        this.physics.pause();
        gameState.enemyVelocity = 1;
        gameState.lives = 3;
        gameState.wave = 1;
        this.add.text(157, 160, 'Game Over', {fontSize: '25px', fill: '#fff', stroke: '#000', strokeThickness: 10});
        this.add.text(45, 190, 'You have failed to protect planet Earth \n       from the alien invasion', {fontSize: '16px', fill: '#fff', stroke: '#000', strokeThickness: 5});
        this.add.text(130, 230, 'Click to try again', {fontSize: '18px', fill: '#fff', stroke: '#000', strokeThickness: 5});
    });

    this.physics.add.collider(gameState.boss, gameState.pBullets, (boss, repellent) => {
        repellent.destroy();
        gameState.boss.setVelocityY(0);
        gameState.bossVelocity *= 1.04;
        gameState.bossHealth--;
        gameState.scoreText.setText(`Boss Health: ${gameState.bossHealth}`);
    });
          
    this.physics.add.collider(gameState.boss, gameState.player, () => {
        gameState.active = false;
        gameState.music.stop();
        gameState.lose.play();
        gameState.eBulletsLoop.destroy();
        this.physics.pause();
        gameState.bossVelocity = 2;
        gameState.lives = 3;
        gameState.wave = 1;
        this.add.text(157, 160, 'Game Over', {fontSize: '25px', fill: '#fff', stroke: '#000', strokeThickness: 10});
        this.add.text(45, 190, 'You have failed to protect planet Earth \n       from the alien invasion', {fontSize: '16px', fill: '#fff', stroke: '#000', strokeThickness: 5});
        this.add.text(130, 230, 'Click to try again', {fontSize: '18px', fill: '#fff', stroke: '#000', strokeThickness: 5});
    });

    this.physics.add.collider(gameState.boss, platforms, () => {
        gameState.active = false;
        gameState.music.stop();
        gameState.lose.play();
        gameState.eBulletsLoop.destroy();
        this.physics.pause();
        gameState.bossVelocity = 2;
        gameState.lives = 3;
        gameState.wave = 1;
        this.add.text(157, 160, 'Game Over', {fontSize: '25px', fill: '#fff', stroke: '#000', strokeThickness: 10});
        this.add.text(45, 190, 'You have failed to protect planet Earth \n       from the alien invasion', {fontSize: '16px', fill: '#fff', stroke: '#000', strokeThickness: 5});
        this.add.text(130, 230, 'Click to try again', {fontSize: '18px', fill: '#fff', stroke: '#000', strokeThickness: 5});
    });

}
  
function update() {
    if (gameState.active) {
        // If the game is active, then players can control Codey
        if (gameState.cursors.left.isDown) {
            gameState.player.setVelocityX(-160);
        } else if (gameState.cursors.right.isDown) {
            gameState.player.setVelocityX(160);
        } else {
            gameState.player.setVelocityX(0);
        }
  
        // Execute code if the spacebar key is pressed
        if (Phaser.Input.Keyboard.JustDown(gameState.cursors.space)) {
            gameState.pBullets.create(gameState.player.x, gameState.player.y, 'pBullet').setScale(0.5).setGravityY(-400);
            gameState.shoot.play();
        }

        if (gameState.player.x > 443) {
            gameState.player.x = 435;
        }
   
        if (numOfTotalEnemies() === 0) {
            if (gameState.wave === 1) {
                newWave()
            } else if (gameState.wave === 2) {
                if (gameState.lives !== 3) {
                    gameState.lives++;
                    gameState.livesText.setText(`Lives: ${gameState.lives}`);
                }
                newWave();
            } else if (gameState.wave === 3) {
                newWave();
            } else if (gameState.wave === 4) {
                if (gameState.lives !== 3) {
                    gameState.lives++;
                    gameState.livesText.setText(`Lives: ${gameState.lives}`);
                }
                newWave();
            } else if (gameState.wave === 5) {
                if (gameState.boss.getChildren().length === 0) {
                    gameState.eBulletsLoop.destroy();
                    bossGen();
                } else {    
                    gameState.boss.getChildren().forEach(boss => {
                        boss.x += gameState.bossVelocity;
                        if (boss.x < 80 || boss.x > 370) {
                            gameState.bossVelocity *= -1;
                            boss.y += 30;
                        }
                        if (gameState.eBullets.getChildren().length < 9) {
                            bossShoot(boss);
                        }
                    })
                }
            }
             
        } else {
            gameState.enemies.getChildren().forEach(enemy => {
                enemy.x += gameState.enemyVelocity;
            })
            gameState.leftMostEnemy = sortedEnemies()[0];
            gameState.rightMostEnemy = sortedEnemies()[sortedEnemies().length - 1];
            if (gameState.leftMostEnemy.x < 16 || gameState.rightMostEnemy.x > 434) {
                gameState.enemyVelocity *= -1;
                gameState.enemies.getChildren().forEach(enemy => {
                enemy.y += 35 -(gameState.wave * 5);
                });
            }
            
        }
        
        if (gameState.bossHealth === 0) {
            gameState.active = false;
            this.physics.pause();
            gameState.music.stop();
            gameState.victory.play();
            gameState.boss.getChildren().forEach(boss => {
                boss.destroy();
            });
            this.add.text(30, 170, '         Congratulations! \n   You have saved planet Earth \n     from the alien invasion!', {fontSize: '20px', fill: '#fff', stroke: '#000', strokeThickness: 5});
        };

        //What occurs after a player has lost all of their lives
        if (gameState.lives === 0) {
            gameState.active = false;
            gameState.music.stop();
            gameState.lose.play();
            gameState.eBulletsLoop.destroy();
            this.physics.pause();
            gameState.enemyVelocity = 1;
            gameState.lives = 3;
            gameState.wave = 1;
            this.add.text(157, 160, 'Game Over', {fontSize: '25px', fill: '#fff', stroke: '#000', strokeThickness: 7});
            this.add.text(45, 190, 'You have failed to protect planet Earth \n       from the alien invasion', {fontSize: '16px', fill: '#fff', stroke: '#000', strokeThickness: 5});
            this.add.text(130, 230, 'Click to try again', {fontSize: '18px', fill: '#fff', stroke: '#000', strokeThickness: 5});
        };
    }
}

// Helper Methods below:
// sortedEnemies() returns an array of enemy sprites sorted by their x coordinate
function sortedEnemies(){
    const orderedByXCoord = gameState.enemies.getChildren().sort((a, b) => a.x - b.x);
    return orderedByXCoord;
}

// numOfTotalEnemies() returns the number of total enemies 
function numOfTotalEnemies() {
    const totalEnemies = gameState.enemies.getChildren().length;
    return totalEnemies;
}

// function which generates the enemies
function waveGen(waveNo) {
    gameState.enemyVelocity = (1 + waveNo)/3;
    for (let yVal = 1; yVal < waveNo + 1; yVal++) {
        for (let xVal = 1; xVal < 9; xVal++) {
            let randomEnemy = gameState.enemyList[Math.floor(Math.random()*3)];
            gameState.enemies.create(50*xVal, 30*yVal, randomEnemy).setGravity(0,-200);
        }
    }
}

function newWave() {
    gameState.wave++;
    gameState.waveText.setText(`Wave: ${gameState.wave}`);
    waveGen(gameState.wave);
    gameState.scoreText.setText(`Enemies Left: ${numOfTotalEnemies()}`);
}

function bossShoot(boss) {
    gameState.eBullets.create(boss.x, boss.y + 55, 'eBullet').setScale(1.5).setGravityY(300);
    gameState.eBullets.create(boss.x + 56, boss.y + 51, 'eBullet').setGravityY(300);
    gameState.eBullets.create(boss.x - 56, boss.y + 51, 'eBullet').setGravityY(300);
}

function bossGen() {
    gameState.waveText.setText('Wave: Boss');
    gameState.scoreText.setText(`Boss Health: ${gameState.bossHealth}`);
    gameState.scoreText.setX(170);
    gameState.boss.create(225, 30, 'boss').setScale(2).setGravityY(-200);
}

const styleW = {fontSize: '16px', fill: '#fff'};
const styleB = {fontSize: '16px', fill: '#000'};
  
const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 420,
    backgroundColor: "0c0a26",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            enableBody: true,
            debug: false,
        }
    },
    scene: {
        preload,
        create,
        update
    }
};
  
  
const game = new Phaser.Game(config);