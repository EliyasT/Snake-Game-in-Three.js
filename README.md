# Snake-Game-in-Three.js
This is a Snake game implemented using Three.js, a popular JavaScript library for creating 3D graphics in web browsers. The game adheres to specific requirements outlined for a project, including visualizations, controls, and game mechanics.
**Requirements**
**1. Environment:** The playing field is placed on large gray ground inside a skybox. Textures from the skybox subdirectory are used for creating the skybox environment.
**2. Lighting:** Ambient lights are added to the scene. A spot light with proper intensity tuning is added to get shadow effects.
**3. Playing Field:** The playing field size is 12x12 with a unit cell size of 1x1.The `FloorsCheckerboard_S_Diffuse.jpg` texture map and `FloorsCheckerboard_S_Normal.jpg` normal map are applied to the playing field. Each unit cell of the playing field is covered by one square of the checkerboard pattern.
**4. Boundary Walls:** Walls of height 1 are added as boundaries to the playing field, with the `hardwood2_diffuse.jpg` texture applied. Repeat-wrapping is set along the boundaries, and the `hardwood2_bump.jpg` bump map is used with a bump scale of 0.1.
**5. Snake:** Cubes with rounded corners are used for the snake, with the `lavatile.jpg` texture applied. The head of the snake is distinguishable from the rest of the body. A snake is initialized as a single cube at rest, placed randomly on the playing field. The snake moves forward by one unit every 250 ms.
**6. Apple:** An apple is placed randomly on the playing field. When the snake's head hits the apple, the snake grows by one unit, and the apple repositions to a random, unoccupied cell. To create the apple, the apple geometry defined in the `Apple.obj` file is used. The apple object is scaled and positioned to fit conveniently into one unit cell, with the `Apple_BaseColor.png` texture applied. The `Apple_Normal.png` file serves as a normal map, and `Apple_Roughness.png` as a specific map.

**7. Controls:** Arrow keys control the direction in which the snake moves. The snake starts moving only after the first keystroke.

**Usage**

To play the game, simply run the provided HTML file in a compatible web browser. Use the arrow keys to control the direction of the snake, and try to eat as many apples as possible without colliding with the walls or the snake's own body.

**Credits**

This project was developed as part of a course assignment and implements various features using the Three.js library. Special thanks to the course instructors and contributors to the Three.js library for their valuable resources and documentation.
