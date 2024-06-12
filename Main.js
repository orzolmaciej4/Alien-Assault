import Phaser from 'phaser';
import AlienAssaultGame from './scenes/AlienAssaultGame';

const config = {
    // Game configuration
};

const game = new Phaser.Game(config);
game.scene.add('AlienAssaultGame', AlienAssaultGame);
game.scene.start('AlienAssaultGame');
