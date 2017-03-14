var hero;
var bird;
var apple;
var delay = 1500;
var tween;
var bird_direction;
var droppings;
var fire_droppings;
var arrow_keys;
var jump;
var jump_sound;
var dropping_sound;
var apple_sound;
var direction;
var droppings_time = 0;
var map;
var background_layer;
var ground_layer;
var scoreText;
var scoreValue;
var score;
var last_int;

var Game = {
	preload: function() {
		game.load.spritesheet('hero_spritesheet_flip', './images/sprite_test1.png', 77, 79, 7);
		game.load.spritesheet('bird_spritesheet', './images/enemy/bird_sheet.png', 200, 145, 8);
		game.load.tilemap('level01', './images/map/outside.json', null, Phaser.Tilemap.TILED_JSON);
		game.load.image('Background', './images/map/level_background.png');
		game.load.image('Ground', './images/map/level_ground.png');
		game.load.image('dropping', './images/enemy/dropping.png');
		game.load.image('apple', 'images/apple.png');
		game.load.audio('sfx1', './sound/jump.mp3');
		game.load.audio('sfx2', './sound/dropping.mp3');
		game.load.audio('sfx3', './sound/apple.mp3');
	},
	
	create: function() {
		game.physics.startSystem(Phaser.Physics.ARCADE);

		game.stage.backgroundColor = "#35383A";

		map = game.add.tilemap('level01');

		map.addTilesetImage('level_background', 'Background');

		map.addTilesetImage('level_ground','Ground');

///////////////////////////////////////////////////////////////////////////////////////////////////////
//how i will set up collisions. parameters: (indexes to collide with, collide = true, layer)
		map.setCollision([4203, 4204, 4221, 4222, 4223, 4224, 4225, 4226, 4227, 4228, 4229, 4230, 4231, 4232, 4233, 4303, 4304, 4321, 4322, 4323, 4324, 4325, 4326, 4327, 4328, 4329, 4330, 4331, 4332, 4333, 4403, 4404], true, 'Ground');
///////////////////////////////////////////////////////////////////////////////////////////////////////

		background_layer = map.createLayer('Background');
		background_layer.resizeWorld();

		ground_layer = map.createLayer('Ground');
		ground_layer.resizeWorld();

		bird = game.add.sprite(0, 50, 'bird_spritesheet');
		bird.scale.setTo(0.5, 0.5);


		hero = game.add.sprite(0, 315, 'hero_spritesheet_flip');
		hero.scale.setTo(0.7, 0.7);

		this.spawnApple();

		droppings = game.add.group();
		droppings.enableBody = true;
		droppings.physicsBodyType = Phaser.Physics.ARCADE;
		//droppings.createMultiple(30, 'dropping');
		droppings.setAll('outofBoundsKill', true);
		droppings.setAll('checkWorldBounds', true);
		droppings.setAll('lifespan', 4000);

		arrow_keys = game.input.keyboard.createCursorKeys();
		jump = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		game.physics.enable(bird, Phaser.Physics.ARCADE);
		game.physics.enable(hero, Phaser.Physics.ARCADE);
		

		hero.animations.add('run_right', [1, 2, 3], 10, true);
		hero.animations.add('run_left', [4, 5, 6], 10, true);

		bird.animations.add('fly_right', [0, 1, 2, 3, 2, 1], 3, true);
		bird.animations.add('fly_left', [4, 5, 6, 7, 6, 5], 3, true);

		bird_direction = 'idle';

		hero.body.setSize(50, 79, 10, 0);
		hero.body.collideWorldBounds = true;

		jump_sound = game.add.audio('sfx1');
		dropping_sound = game.add.audio('sfx2');
		apple_sound = game.add.audio('sfx3');

		score = 0;
		delay = 1500;
		fire_droppings = true;

		scoreText = game.add.text(30, 20, 'Score: ', {font: "bold 22px sans-serif", fill: "#000000", align: "center"});
		scoreValue = game.add.text(115, 20, score.toString(), {font: "bold 22px sans-serif", fill: "#000000", align: "center"});
	},

	update: function() {
		game.physics.arcade.collide(hero, ground_layer);

		if(game.time.now > droppings_time) {
			fireDropping();
		} 

		if(bird.x == 0) {
			game.add.tween(bird).to({x: '+700'}, 5000, Phaser.Easing.Linear.None, true);
			if(bird_direction != 'right') {
				bird.animations.play('fly_right');
				bird_direction = 'right';
			}
		}
		if(bird.x == 700) {
			game.add.tween(bird).to({x: '-700'}, 5000, Phaser.Easing.Linear.None, true);
			if(bird_direction != 'left') {
				bird.animations.play('fly_left');
				bird_direction = 'left';
			}
		}
		

		hero.body.velocity.x = 0;
		hero.body.gravity.y = 500;

		if(arrow_keys.left.isDown) {
			hero.body.gravity.y = 500;
			hero.body.velocity.x = -175;

			if(direction != 'left') {
				hero.animations.play('run_left');
				direction = 'left';
			}
		}
		else if(arrow_keys.right.isDown) {
			hero.body.gravity.y = 500;
			hero.body.velocity.x = 175;

			if(direction != 'right') {
				hero.animations.play('run_right');
				direction = 'right';
			}
		}
		else {
			if(direction != 'idle') {
				hero.animations.stop();
				hero.body.gravity.y = 500;
				hero.body.velocity.y = 0;

				if(direction == 'left') {
					hero.frame = 5;
				}
				else {
					hero.frame = 0;
				}

				direction = 'idle';
			}
		}

		if(jump.isDown && hero.body.onFloor()) {
			jump_sound.play();
			hero.body.velocity.y = -350;
		}
		
		if(hero.body.onFloor() == false) {
			hero.body.gravity.y = 500;
		}

		game.physics.arcade.overlap(hero, droppings, hitByDropping, null, this);
		
		if(game.physics.arcade.collide(hero, apple)) {
			this.collectApple();
		}
	},

	render: function() {
		//game.debug.body(hero);
		//game.debug.body(apple);

	},

	spawnApple: function() {
		var random_int = Math.floor(Math.random() * 5) + 1;
		console.log("random_int: %d", random_int);
		console.log("last_int: %d", last_int);
		if(random_int != last_int) {
			if(random_int == 1) {
				last_int = random_int;
				apple = game.add.sprite(190, 239, 'apple');
			}
			if(random_int == 2) {
				last_int = random_int;
				apple = game.add.sprite(580, 239, 'apple');
			}
			if(random_int == 3) {
				last_int = random_int;
				apple = game.add.sprite(190, 439, 'apple');
			}
			if(random_int == 4) {
				last_int = random_int;
				apple = game.add.sprite(580, 439, 'apple');
			}
			if(random_int == 5) {
				last_int = random_int;
				apple = game.add.sprite(390, 339, 'apple');
			}
		}
		else {
			this.spawnApple();
		}

		//last_int = random_int;
		//random_int = 0;
		game.physics.enable(apple, Phaser.Physics.ARCADE);
	},

	collectApple: function() {
		apple_sound.play();
		apple.destroy();
		score = score + 1;
		//console.log("score: %d", score);
		scoreValue.text = score.toString();

		if(score % 5 == 0) {
			delay = delay - 100;
		}
		
		this.spawnApple();
	}	
};

function fireDropping() {
	//dropping = droppings.getFirstExists();
	if(fire_droppings == true) {
		dropping = droppings.create(bird.x + 50, bird.y + 50, 'dropping');

		if(dropping) {
			dropping_sound.play();
			game.physics.arcade.moveToObject(dropping, hero, 100);
			//console.log(delay);
			droppings_time = game.time.now + delay;
		}
	}

}

function hitByDropping(hero, dropping) {
		hero.kill();
		dropping.kill();
		game.add.text(game.world.centerX - 160, game.world.centerY - 20, "GAME OVER \n CLICK TO RESTART", {font: "bold 32px sans-serif", fill: "#000000", align: "center"});
		fire_droppings = false;
		game.input.onTap.addOnce(restartGame, this);
	}

function restartGame() {
	game.state.start('Game');
}
