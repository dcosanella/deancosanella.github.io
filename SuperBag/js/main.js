var game;

//create game window
game = new Phaser.Game(800, 600, Phaser.AUTO, '');

//create game states
game.state.add('Menu', Menu);

game.state.add('Game', Game);

//game.state.add('Game_Over', Game_Over);


//start the game at the menu state
game.state.start('Menu');