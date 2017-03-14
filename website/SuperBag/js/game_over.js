var Game_Over = {
	preload: function() {
		game.load.tilemap('level01', './images/map/outside.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('Background', './images/map/level_background.png');
		game.load.image('Ground', './images/map/level_ground.png');
		game.load.image('dropping', './images/enemy/dropping.png');
		game.load.image('outside', './images/map/outside.png');
	},

	create: function() {
		/*var map = game.add.tilemap('level01');

		map.addTilesetImage('level_background', 'Background');

		map.addTilesetImage('level_ground','Ground');

		var background_layer = map.createLayer('Background');
		background_layer.resizeWorld();

		var ground_layer = map.createLayer('Ground');
		ground_layer.resizeWorld();*/

		this.add.button(0, 0, 'outside', this.restartGame, this);

		game.add.text(235, 350, "GAME OVER", {font: "bold 16px sans-serif", fill: "#46c0f9", align: "center"});
	},

	restartGame: function() {
		this.state.start('Game');
	}
}