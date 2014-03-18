/*jslint browser: true, white: true, plusplus: true */
/*global ASTEROIDGAME */
ASTEROIDGAME.screens['main-menu'] = (function() {
	'use strict';
	
	function initialize() {
		//
		// Setup each of menu events for the screens
	
		$('#id-new-game').click(function(e){
			ASTEROIDGAME.game.showScreen('game-play');	
		});

		$('#id-high-scores').click(function(e){
			ASTEROIDGAME.game.showScreen('high-scores');
			})

		$('#id-help').click(function(e){
			ASTEROIDGAME.game.showScreen('help');
		})
		$('#id-about').click(function(e){
			ASTEROIDGAME.game.showScreen('about');
		})
		$('#id-quit').click(function(e){
			ASTEROIDGAME.screens['game-play'].cancel();
			ASTEROIDGAME.game.showScreen('about');
		})
	}
	
	function run() {
		//
		// I know this is empty, there isn't anything to do.
	}
	
	return {
		initialize : initialize,
		run : run
	};
}());
