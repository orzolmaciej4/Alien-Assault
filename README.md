# Alien-Assault
Alien Assault is a 2D shooter game inspired by classic arcade games like Space Invaders. The player must defend Earth from waves of alien invaders and defeat a powerful boss in the final wave. Built using Phaser 3, this game features intuitive controls, dynamic gameplay, and engaging visuals and sounds.

## Features
- Player Controls:
Move left and right using the arrow keys.
Shoot bullets using the spacebar.

- Enemy Waves:
Multiple waves of enemies with increasing difficulty.

- Boss Battle:
A challenging final boss with higher health and unique attacks.

- Game States:
Active gameplay, game over, and victory conditions.
Display messages for game over and victory with options to restart.

- Sound Effects:
Background music during gameplay.
Sound effects for shooting, hitting enemies, and game over.

## Project Structure
- scenes/AlienAssault.js:
Core game logic including game state management, preload, create, and update functions.
Helper methods for sorting enemies, generating waves, and handling boss mechanics.

- Main.js:
Initializes the Phaser game instance.
Configures game settings and starts the main game scene.

- index.html:
Basic HTML structure to host the game in a web browser.
Loads the Phaser library and includes the game script.

- assets folder:
Contains the images and sounds used in the game

- components folder:
Contains additional JavaScript files, however these were not used in the final implementation

## Setup Instructions
To run the game, just clone the repository and open index.html in a web browser.

## How to Play
- Use the arrow keys to move your character left and right.
- Press the spacebar to shoot bullets at the enemies.
- Survive through waves of enemies and defeat the final boss to win the game.
- If you lose all your lives or the enemies reach the bottom, the game is over. Click to restart.
