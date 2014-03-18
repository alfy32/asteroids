/*jslint browser: true, white: true, plusplus: true */
/*global ASTEROIDGAME, console, KeyEvent, requestAnimationFrame, performance */
ASTEROIDGAME.screens['game-play'] = (function() {
	'use strict';
	
	var mouseCapture = false,
		myMouse = ASTEROIDGAME.input.Mouse(),
		myKeyboard = ASTEROIDGAME.input.Keyboard(),
		myShip = null,
		cancelNextRequest = false;
	
	function initialize() {
		console.log('game initializing...');

		window.onresize = ASTEROIDGAME.graphics.resize;

		
		myShip = ASTEROIDGAME.graphics.Ship( {
			image : ASTEROIDGAME.images['/images/longBrownShip.png'],
			center : { x : (Math.floor(window.innerWidth/2)), y : (Math.floor(window.innerHeight/2))},
			width : 100, height : 100,
			rotation : 0,
			moveRate : 400,			// pixels per second
			rotateRate : 6.14159	// Radians per second
		});
		
		//
		// Create the keyboard input handler and register the keyboard commands
		myKeyboard.registerCommand(KeyEvent.DOM_VK_A, myShip.moveLeft);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_D, myShip.moveRight);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_W, myShip.moveUp);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_S, myShip.moveDown);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_Q, myShip.rotateLeft);
		myKeyboard.registerCommand(KeyEvent.DOM_VK_E, myShip.rotateRight);

		myKeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
			//
			// Stop the game loop by canceling the request for the next animation frame
			cancelNextRequest = true;
			//
			// Then, return to the main menu
			ASTEROIDGAME.game.showScreen('main-menu');
		});

		ASTEROIDGAME.graphics.resize();
		//
		// Create an ability to move the logo using the mouse
		/*
		myMouse = ASTEROIDGAME.input.Mouse();
		myMouse.registerCommand('mousedown', function(e) {
			mouseCapture = true;
			myShip.moveTo({x : e.clientX, y : e.clientY});
		});

		myMouse.registerCommand('mouseup', function() {
			mouseCapture = false;
		});

		myMouse.registerCommand('mousemove', function(e) {
			if (mouseCapture) {
				myShip.moveTo({x : e.clientX, y : e.clientY});
			}
		});
	*/
		
	}
	
	//------------------------------------------------------------------
	//
	// This is the Game Loop function!
	//
	//------------------------------------------------------------------
	function gameLoop(time) {
		ASTEROIDGAME.elapsedTime = time - ASTEROIDGAME.lastTimeStamp;
		ASTEROIDGAME.lastTimeStamp = time;

		myKeyboard.update(ASTEROIDGAME.elapsedTime);
		myMouse.update(ASTEROIDGAME.elapsedTime);

		ASTEROIDGAME.graphics.clear();
		myShip.draw();

		if (!cancelNextRequest) {
			requestAnimationFrame(gameLoop);
		}
	}
	
	function run() {
		console.log('running Game');
		initialize();

		ASTEROIDGAME.lastTimeStamp = performance.now();
		//
		// Start the animation loop
		cancelNextRequest = false;
		myKeyboard.clear();
		requestAnimationFrame(gameLoop);
	}

	function cancel(){
		cancelNextRequest = true;
	}
	return {
		initialize : initialize,
		run : run,
		cancel : cancel
	}
}());