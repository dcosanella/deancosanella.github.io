var Menu = {
	preload: function() {
		game.load.image('menu', './images/outside.png');
	},

	create: function() {
		//add menu screen
		//it will act as a button to start the game
		this.add.button(0, 0, 'menu', this.startGame, this);
		game.add.text(game.world.centerX - 135, game.world.centerY - 20, " SUPER BAG \n CLICK TO START", {font: "bold 32px sans-serif", fill: "#000000", align: "center"});
	},

	startGame: function() {
		//change the state to the actual game
		this.state.start('Game');
	}
};