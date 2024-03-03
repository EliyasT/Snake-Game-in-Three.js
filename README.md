# Snake-Game-in-Three.js
This is a Snake game implemented using Three.js, a popular JavaScript library for creating 3D graphics in web browsers. The game adheres to specific requirements outlined for a project, including visualizations, controls, and game mechanics.

**1. Gameplay Mechanics**
The game is set on a gray playing field with a size of 12x12 units, divided into individual unit cells.
A snake is placed on the playing field, initially consisting of a single cube at a random unit square.
A red apple is placed in a random cell on the playing field.
The snake moves forward by one unit every 250 ms, controlled by arrow keys to specify direction.
**2. Visual Elements**
The playing field is set on a large gray field inside a skybox, with textures applied to create a realistic environment.
Walls of height 1 serve as boundaries to the playing field, with textures applied for visual detail.
The snake is represented by cubes with rounded corners, distinguished by a green cube for the head and blue cubes for the body.
The apple object is placed on the playing field and textured with a red apple image.
A display board is added to show the snake game, with a camera located at the head of the snake and looking in the direction of motion.
A 3D clock is added to the right-top corner of the display board to display the time.
Text geometry is added to display the length of the snake at the right-bottom corner of the display board.
**3. Lighting and Shadows**
Lighting is implemented with a spot light and ambient light in the scene, adjusted for proper intensity.
Shadows are cast by the snake, apple, boundary walls, and display board on the ground and playing field, enhancing visual realism.
**4. Scalability**
The project is designed for scalability, allowing for potential future enhancements or additions to gameplay mechanics, visual elements, and overall functionality.

**Usage**

To play the game, simply run the provided HTML file in a compatible web browser. Use the arrow keys to control the direction of the snake, and try to eat as many apples as possible without colliding with the walls or the snake's own body.

**Credits**

This project was developed as part of a course assignment and implements various features using the Three.js library. Special thanks to the course instructors and contributors to the Three.js library for their valuable resources and documentation.
