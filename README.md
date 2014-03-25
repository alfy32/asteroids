Asteroids - Team Assignment 1
=============================

### Introduction

The first projects have given you an opportunity to develop skills in architecting and coding a game, along with learning (probably) a new language and development platform (web).  This project's purpose is to put all of that to work in a more sophisticated game.

This is intended to be the biggest project of the semester, with the final project having a smaller scope than this one.


### Assignment

Write an Asteroids Evolved game, using the following wiki page for background information:

  http://en.wikipedia.org/wiki/Asteroids_(arcade_game)

To see the kind of quality I'm looking for, please view the video at the following link:

[Asteroids Evolved](http://www.youtube.com/watch?v=GTgrqyy-Weo)

[![Asteroids Evolved](http://img.youtube.com/vi/GTgrqyy-Weo/3.jpg)](http://www.youtube.com/watch?v=GTgrqyy-Weo)


Pay attention to the rotating asteroids (you'll be in 2D, not 3D), the background, the different kinds of particle effects, the exhaust trail that follows the ship and enemy flying saucer.  Your game should have all of these features at this level of quality.  This game should be visually great, play great, and run smoothly!

The following are the required project elements:

* Must substantially implement the Asteroids game play. This is a ship that starts in the center and has a bunch of asteroids float around it, with the player trying to clear the screen, and every once in a while a UFO shows up that randomly shoots bullets around. **No friction on the player ship!**
  * Player starts with three lives.
  * Hyperspace ability, smartly place the ship in a "safe" location.
  * You can decide how many and how often the ship can fire, but it better be at least 4 active missiles.
  * Must include both UFO types.
  * Use the scoring system described on the wiki page, including when UFOs appear, and new lives given.  You'll have to decide how much to score when asteroids are hit and destroyed.
  * Utilize three different asteroid sizes.  Largest break into three, middle break into four.
* Use HTML5 2D Canvas rendering.  The example is in 3D, but you are working in 2D.
* Must utilize particle effects; again look at the example gameplay clip.
* Must use sound effects. Let's plan on Google Chrome as the only browser that has to be supported for sound.
* Presentation must include at least the following:
  * Menu: New Game, Controls, High Scores, Credits
  * During Game Play
    * Current Score
    * Current Level
    * Number of Lives Left
  * User ability to change controls.
* High Scores are persistent between gameplay sessions, persisting to the server, and surviving server restarts (i.e., save the scores to a file and read when the server starts).  Use the following web service API definition:
  * GET : /v1/high-scores
    * Returns all scores from the server in a JSON format.  You may choose the specific JSON format.
  * POST : /v1/high-scores?name={name}&score={score}
    * Sends a new score to the server.  The server should only keep the top ten high scores.
  * Feel free to add additional APIs to suit your particular needs, but you most implement the above two.
* AI Component:  Attract Mode.
  * Begins after 10 seconds of inactivity on the Main Menu.
  * Ends when the user moves the mouse or presses any keyboard key.
  * During Attract Mode the AI player must be able to clear one full level of asteroids, taking at least 60 seconds to do so.
* All pages, code, and assets must be served from a NodeJS server.

### Development Milestones

The following are the development milestones we developed in class:

1. Ship Rendering & Movement : by 3/21/2014
2. Asteroids moving, collision detection : 3/28/2014
3. Particle system, projectiles doing things : 4/4/2014

These are to help push you to work on the game before it is due, they don't necessarily provide enough to suggest you'll get the game done if you only complete the milestones by those dates.  Work early and often on this game.  Bring issue to class and let's discuss them as a group, allowing everyone to benefit from the experience.  I'm quite excited for this game, I'm looking forward to some great work!
