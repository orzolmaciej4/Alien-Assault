import { gameState } from '../AlienAssault';
export function setPlayerControls(scene) {
    const { cursors, pBullets, player, shoot } = gameState;

    scene.input.keyboard.on('keydown-SPACE', () => {
        if (gameState.active && Phaser.Input.Keyboard.JustDown(cursors.space)) {
            pBullets.create(player.x, player.y, 'pBullet').setScale(0.5).setGravityY(-400);
            shoot.play();
        }
    });

    scene.input.keyboard.on('keydown-LEFT', () => {
        if (gameState.active) {
            player.setVelocityX(-160);
        }
    });

    scene.input.keyboard.on('keydown-RIGHT', () => {
        if (gameState.active) {
            player.setVelocityX(160);
        }
    });

    scene.input.keyboard.on('keyup-LEFT', () => {
        if (gameState.active) {
            player.setVelocityX(0);
        }
    });

    scene.input.keyboard.on('keyup-RIGHT', () => {
        if (gameState.active) {
            player.setVelocityX(0);
        }
    });
}
