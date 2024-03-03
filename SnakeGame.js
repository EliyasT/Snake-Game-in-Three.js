"use strict";

import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

// * Initialize webGL
const canvas = document.getElementById("myCanvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setClearColor("rgb(255,255,255)"); // set background color
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  canvas.width / canvas.height,
  0.1,
  100
);
camera.position.set(0, 12, 15);
scene.add(camera);
camera.lookAt(scene.position);
window.addEventListener("resize", function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Adding Light
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);
//Adding spotLight
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.castShadow = true;
spotLight.shadow.focus = 10;
spotLight.intensity = 100;
spotLight.position.set(1, 10, 0);
scene.add(spotLight);

const skyboxDim = 100;
const skyboxTex = [
  "resources/skybox/px.jpg",
  "resources/skybox/nx.jpg",
  "resources/skybox/py.jpg",
  "resources/skybox/ny.jpg",
  "resources/skybox/pz.jpg",
  "resources/skybox/nz.jpg",
];
const loader = new THREE.TextureLoader();
let skyboxTexs = [];
skyboxTex.forEach((image) => {
  const texture = loader.load(image);
  skyboxTexs.push(
    new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide })
  );
});

//Adding skybox
const boxGeometry = new THREE.BoxGeometry(skyboxDim, skyboxDim, skyboxDim);
const skybox = new THREE.Mesh(boxGeometry, skyboxTexs);
skybox.position.copy(camera.position);
scene.add(skybox);

// Adding Graay floor
const floorGeo = new THREE.CircleGeometry(skyboxDim / 2, 50);
const floorMat = new THREE.MeshPhongMaterial({
  color: 0x808080,
});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotateX(-Math.PI / 2);
floor.position.y -= 0.01;
floor.receiveShadow = true;
scene.add(floor);

//creating playing field
const fieldWidth = 12;
const planeGeometry = new THREE.PlaneGeometry(fieldWidth, fieldWidth);
const mapTex = loader.load("resources/FloorsCheckerboard_S_Diffuse.jpg");
const normalMapTex = loader.load("resources/FloorsCheckerboard_S_Normal.jpg");
mapTex.wrapS = THREE.RepeatWrapping;
mapTex.wrapT = THREE.RepeatWrapping;
normalMapTex.wrapS = THREE.RepeatWrapping;
normalMapTex.wrapT = THREE.RepeatWrapping;
mapTex.repeat.set(2, 2);
normalMapTex.repeat.set(2, 2);

const planeMaterial = new THREE.MeshPhongMaterial({
  color: "white",
  map: mapTex,
  normalMap: normalMapTex,
  transparent: true,
  opacity: 0.5,
  side: THREE.DoubleSide,
});

const playingField = new THREE.Mesh(planeGeometry, planeMaterial);
playingField.rotateX(-Math.PI / 2);
playingField.receiveShadow = true;
scene.add(playingField);

//Adding Boundary
const wallTickness = 0.2;
const wallHeight = 1;
const wallX = new THREE.BoxGeometry(
  fieldWidth + 2 * wallTickness,
  wallHeight,
  wallTickness
);
const wallZ = new THREE.BoxGeometry(wallTickness, wallHeight, fieldWidth);
const wallTex = loader.load("resources/hardwood2_diffuse.jpg");
wallTex.wrapS = THREE.RepeatWrapping;
wallTex.wrapT = THREE.RepeatWrapping;
wallTex.repeat.set(3, 1);
const wallBump = loader.load("resources/hardwood2_bump.jpg");
const wallMaterial = new THREE.MeshPhongMaterial({
  color: "white",
  map: wallTex,
  bumpMap: wallBump,
  bumpScale: 0.1,
});
const boundaryX1 = new THREE.Mesh(wallX, wallMaterial);
const boundaryZ1 = new THREE.Mesh(wallZ, wallMaterial);
boundaryX1.receiveShadow = true;
boundaryX1.castShadow = true;
boundaryZ1.receiveShadow = true;
boundaryZ1.castShadow = true;
const boundaryX2 = boundaryX1.clone();
const boundaryZ2 = boundaryZ1.clone();
boundaryX1.position.set(0, wallHeight / 2, (fieldWidth + wallTickness) / 2);
boundaryX2.position.set(0, wallHeight / 2, -(fieldWidth + wallTickness) / 2);
boundaryZ1.position.set((fieldWidth + wallTickness) / 2, wallHeight / 2, 0);
boundaryZ2.position.set(-(fieldWidth + wallTickness) / 2, wallHeight / 2, 0);
scene.add(boundaryX1);
scene.add(boundaryX2);
scene.add(boundaryZ1);
scene.add(boundaryZ2);

// Adding Display Board
const boardWidth = 8;
const boardHeight = 2;
const displayBoardWidth = 6;
const postHeight = 2.5;
const postDim = 0.1;
const boardThickness = 0.05;
const boardStandGeometry = new THREE.BoxGeometry(postDim, postHeight, postDim);
const boardStandMaterial = new THREE.MeshPhongMaterial({ color: "black" });
const post1 = new THREE.Mesh(boardStandGeometry, boardStandMaterial);

post1.position.set(
  boardWidth / 2,
  postHeight / 2,
  -(fieldWidth / 2 + wallTickness + postDim / 2)
);
post1.receiveShadow = true;
post1.castShadow = true;
const post2 = post1.clone();
post2.position.x = -post1.position.x;
scene.add(post1);
scene.add(post2);

const boardGeom = new THREE.BoxGeometry(
  boardWidth,
  boardHeight,
  boardThickness
);

const boardMat = new THREE.MeshPhongMaterial({
  color: "black",
});
const board = new THREE.Mesh(boardGeom, boardMat);
board.position.set(0, postHeight, -(fieldWidth / 2 + wallTickness + postDim));
board.receiveShadow = true;
board.castShadow = true;
scene.add(board);

const rtHeight = 256;
const rtWidth = rtHeight * (displayBoardWidth / boardHeight);
const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);
const renderTargetCamera = new THREE.PerspectiveCamera(
  90,
  rtWidth / rtHeight,
  0.1,
  1000
);

const displayBoardGeometry = new THREE.BoxGeometry(
  displayBoardWidth,
  boardHeight,
  boardThickness
);
const displayBoardMaterial = new THREE.MeshPhongMaterial({
  color: "white",
  map: renderTarget.texture,
});
const displayBoard = new THREE.Mesh(displayBoardGeometry, displayBoardMaterial);
displayBoard.position.set(
  -boardWidth / 8,
  postHeight,
  -(fieldWidth / 2 + wallTickness + postDim / 2)
);
displayBoard.receiveShadow = true;
displayBoard.castShadow = true;
scene.add(displayBoard);

//Function for randomly positioning object on the playing field
const cellSize = 1;
const sideLength = cellSize * 0.95;
const array = colon(-(fieldWidth / 2 - cellSize), fieldWidth / 2); //Array of Possible x,y coordinate values
function getRandomPosition(object) {
  object.position.x = array[Math.floor(Math.random() * 10)] - cellSize / 2;
  object.position.z = array[Math.floor(Math.random() * 10)] - cellSize / 2;
  object.position.y = 0.3;
}

//function for creating array
function colon(start, end, incr = 1) {
  const N = Math.floor((end - start) / incr) + 1;
  const array = new Array(N);
  array[0] = start;
  for (let i = 1; i < N; i++) {
    array[i] = array[i - 1] + incr;
  }
  return array;
}

//Creating the snake head
const snakeTex = loader.load("resources/lavatile.jpg");
snakeTex.wrapS = THREE.RepeatWrapping;
snakeTex.wrapT = THREE.RepeatWrapping;
let snakeLength = 0;
let speed = new THREE.Vector3(0, 0, 0);
const w = sideLength / 2; // half of width of the cube
const h = 0.125; // Height of the cube
const shape = new THREE.Shape();
shape.moveTo(-w, -h);
shape.lineTo(-w, h);
shape.lineTo(w, h);
shape.lineTo(w, -h);
shape.lineTo(-w, -h);

const extrudeSettings = {
  steps: 1,
  depth: sideLength,
  bevelThickness: 0.05,
  bevelSize: 0.05,
  bevelEnabled: true,
  bevelSegments: 8,
};

const snakeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

const snakeMaterial = new THREE.MeshPhongMaterial({
  color: 0x964b00,
  map: snakeTex,
});
const snakeHead = new THREE.Mesh(snakeGeometry, snakeMaterial);

// Calculate the current center of the object
const center = new THREE.Vector3();
snakeGeometry.computeBoundingBox();
snakeGeometry.boundingBox.getCenter(center);
snakeGeometry.translate(-center.x, -center.y, -center.z);
snakeGeometry.boundingBox.getCenter(center);

snakeHead.receiveShadow = true;
snakeHead.castShadow = true;
snakeHead.position.x = array[Math.floor(Math.random() * 10)] - cellSize / 2;
snakeHead.position.y = h + 0.05;
snakeHead.position.z = array[Math.floor(Math.random() * 10)] - cellSize / 2;
snakeHead.scale.set(0.95, 1, 0.95);
scene.add(snakeHead);
renderTargetCamera.position.copy(snakeHead.position);
renderTargetCamera.lookAt(scene.position);

//creating snake body
const tailMaterial = new THREE.MeshPhongMaterial({
  color: 0x887333,
  map: snakeTex,
});

//function for creating snake body
function createTail() {
  const tail = new THREE.Mesh(snakeGeometry, tailMaterial);
  tail.receiveShadow = true;
  tail.castShadow = true;
  return tail;
}

//Adding the apple
//function to load object
async function loadObjectFromFile(url) {
  const result = {
    then(resolve, reject) {
      const loader = new OBJLoader();
      loader.load(
        url,
        (object) => {
          resolve(object);
        },
        undefined,
        (error) => {
          reject(error);
        }
      );
    },
  };
  return await result;
}

const appleTex = loader.load("resources/Apple_BaseColor.png");
const appleNormal = loader.load("resources/Apple_Normal.png");
const appleSpec = loader.load("resources/Apple_Roughness.png");

// Create a material with the texture
const appleMat = new THREE.MeshPhongMaterial({
  color: "white",
  map: appleTex,
  normalMap: appleNormal,
  specularMap: appleSpec,
});

const apple = await loadObjectFromFile("resources/Apple.obj");

apple.traverse(function (child) {
  if (child instanceof THREE.Mesh) {
    child.material = appleMat;
  }
});
apple.scale.set(0.01, 0.008, 0.01);
getRandomPosition(apple);

//check if the position is not occupied by snake
while (
  apple.position.x === snakeHead.position.x &&
  apple.position.z === snakeHead.position.z
) {
  getRandomPosition(apple);
}

apple.receiveShadow = true;
apple.castShadow = true;
scene.add(apple);

// Handling keyboard input
function handleKeyDown(event) {
  event.preventDefault();
  if (event.key === "ArrowLeft" && speed.x != 1) {
    speed.x = -1;
    speed.z = 0;
  }
  if (event.key === "ArrowRight" && speed.x != -1) {
    speed.x = 1;
    speed.z = 0;
  }
  if (event.key === "ArrowDown" && speed.z != -1) {
    speed.z = 1;
    speed.x = 0;
  }
  if (event.key === "ArrowUp" && speed.z != 1) {
    speed.z = -1;
    speed.x = 0;
  }
}
document.addEventListener("keydown", handleKeyDown);

function isGameOver() {
  if (isOutOfBoundary() || isIntersect()) {
    return true;
  } else {
    return false;
  }
}

//check if the snake is with in boundry
function isOutOfBoundary() {
  return (
    snakeHead.position.x > fieldWidth / 2 ||
    snakeHead.position.x < -fieldWidth / 2 ||
    snakeHead.position.z > fieldWidth / 2 ||
    snakeHead.position.z < -fieldWidth / 2
  );
}

//check if the snake intersect it self
function isIntersect() {
  for (let i = 1; i < snakeArray.length; i++) {
    if (
      snakeHead.position.x === snakeArray[i].position.x &&
      snakeHead.position.z === snakeArray[i].position.z
    ) {
      return true;
    }
  }
  return false;
}

//Grow the snake when ever it eats the apple
const snakeArray = [];
const snakeTailPosition = [];
const eatingSound = new Audio("resources/sound2.wav");
const collisionSound = new Audio("resources/sound1.wav");

function growSnake() {
  if (!isGameOver()) {
    for (let i = 0; i < snakeArray.length; i++) {
      snakeArray[i].position.x = snakeTailPosition[i][0];
      snakeArray[i].position.z = snakeTailPosition[i][1];
      snakeArray[i].position.y = snakeHead.position.y;
      scene.add(snakeArray[i]);
    }
    if (
      snakeHead.position.x === apple.position.x &&
      snakeHead.position.z === apple.position.z
    ) {
      snakeTailPosition.push([apple.position.x, apple.position.z]);
      const snakeTail = createTail();
      snakeTail.scale.set(0.95, 1, 0.95);
      snakeArray.push(snakeTail);
      scene.remove(apple);
      snakeLength++;
      displayLength();
      eatingSound.play();
      scene.add(apple);
      getRandomPosition(apple);
      //check if the position is not occupied by snake
      const occupied = snakeArray.some((position) => {
        return (
          position.position.x === apple.position.x &&
          position.position.z === apple.position.z
        );
      });
      while (occupied) {
        getRandomPosition(apple);
      }
    }
  } else {
    collisionSound.play();
    alert(`Game Over!\nSnake Length: ${snakeLength}`);
  }
}

//move the snake to the direction of pressed arrow
function moveSnake() {
  snakeHead.position.add(speed.clone());
  renderTargetCamera.position.copy(snakeHead.position);
  for (let i = snakeTailPosition.length; i > 0; i--) {
    snakeTailPosition[i] = snakeTailPosition[i - 1];
  }
  const cameraPos = new THREE.Vector3();
  cameraPos.copy(snakeHead.position);
  if (snakeTailPosition.length) {
    if (speed.x === 1) {
      cameraPos.x += 1;
      renderTargetCamera.lookAt(cameraPos);
      snakeTailPosition[0] = [snakeHead.position.x - 1, snakeHead.position.z];
    }
    if (speed.x === -1) {
      cameraPos.x -= 1;
      renderTargetCamera.lookAt(cameraPos);
      snakeTailPosition[0] = [snakeHead.position.x + 1, snakeHead.position.z];
    }
    if (speed.z === 1) {
      cameraPos.z += 1;
      renderTargetCamera.lookAt(cameraPos);
      snakeTailPosition[0] = [snakeHead.position.x, snakeHead.position.z - 1];
    }
    if (speed.z === -1) {
      cameraPos.z -= 1;
      renderTargetCamera.lookAt(cameraPos);
      snakeTailPosition[0] = [snakeHead.position.x, snakeHead.position.z + 1];
    }
  }
}

//Moving the snake forward by one unit every 250ms
setInterval(moveSnake, 250);

//adding clock
// creating the outer cylicerical ring
const outerRadius = 11;
const height = 1;
const innerRadius = 10;
const points = new Array(5);
points[0] = new THREE.Vector2(innerRadius, 0);
points[1] = new THREE.Vector2(innerRadius, height);
points[2] = new THREE.Vector2(outerRadius, height);
points[3] = new THREE.Vector2(outerRadius, 0);
points[4] = new THREE.Vector2(innerRadius, 0);
const ringGeo = new THREE.LatheGeometry(points, 500);
const ringMat = new THREE.MeshPhongMaterial({ color: "#00ffff" });
const outerRing = new THREE.Mesh(ringGeo, ringMat);
outerRing.rotation.x = Math.PI / 2;
scene.add(outerRing);

//Creating the cylinder for the body of the clock
const radius = 10;
const CylinderGeometry = new THREE.CylinderGeometry(radius, radius, height, 32);
const cylinderMaterial = new THREE.MeshPhongMaterial({ color: "#ffffff" });
const clockBody = new THREE.Mesh(CylinderGeometry, cylinderMaterial);
clockBody.position.y = height / 2;
outerRing.add(clockBody);

//Adding Blob
const blobRadius = 0.8;
const blobGeo = new THREE.SphereGeometry(blobRadius, 32, 32);
const blobMat = new THREE.MeshPhongMaterial({ color: "#000000" });
const blob = new THREE.Mesh(blobGeo, blobMat);
blob.scale.set(1, 0.1, 1);
blob.position.y = blobRadius * blob.scale.y + height / 2;
clockBody.add(blob);

//Adding hand for hour
const sphRadius = 2;
const hrGeo = new THREE.SphereGeometry(sphRadius, 32, 32);
const hrMat = new THREE.MeshPhongMaterial({ color: "#000000" });
const hrHand = new THREE.Mesh(hrGeo, hrMat);
hrHand.rotation.y = Math.PI / 2;
hrHand.scale.set(1.5, 0.1, 0.1);
hrHand.position.set(
  0,
  sphRadius * hrHand.scale.y + height / 2,
  -hrHand.scale.x * sphRadius
);
clockBody.add(hrHand);

//Adding hand for minute
const minGeo = new THREE.SphereGeometry(sphRadius, 32, 32);
const minMat = new THREE.MeshPhongMaterial({ color: "#000000" });
const minHand = new THREE.Mesh(minGeo, minMat);
minHand.rotation.y = Math.PI / 2;
minHand.scale.set(2, 0.1, 0.1);
minHand.position.set(
  0,
  sphRadius * minHand.scale.y + height / 2,
  -minHand.scale.x * sphRadius
);
clockBody.add(minHand);

//Adding hand for Second
const length = 9;
const thickness = 0.2;
const depth = 0.1;
const secGeo = new THREE.BoxGeometry(length, depth, thickness);
const secMat = new THREE.MeshPhongMaterial({ color: "#000000" });
const secHand = new THREE.Mesh(secGeo, secMat);
secHand.rotation.y = Math.PI / 2;
secHand.position.set(0, (depth + height) / 2, (-secHand.scale.x * length) / 2);
clockBody.add(secHand);

//Adding thick to mark 12 0'clock
const tickLength = 2;
const tickThickness = 0.3;
const tickDepth = 0.1;
const tGeo = new THREE.BoxGeometry(tickThickness, tickDepth, tickLength);
const tMat = new THREE.MeshPhongMaterial({ color: "#008b8b" });
const tick = new THREE.Mesh(tGeo, tMat);
tick.position.set(0, (tickDepth + height) / 2, tickLength / 2 - radius);
clockBody.add(tick);

//Adding tick for every 5 minutes
const bigTickMat = new THREE.MeshPhongMaterial({ color: "#000000" });
const bigTick = new THREE.Mesh(tGeo, bigTickMat);
bigTick.position.set(0, (tickDepth + height) / 2, tickLength / 2 - radius);
createTicks(bigTick, 12);

//Adding tick for every minutes
const smallTick = bigTick.clone();
smallTick.scale.set(0.5, 1, 0.5);
smallTick.position.set(
  0,
  (tickDepth + height) / 2,
  (smallTick.scale.z * tickLength) / 2 - radius
);
createTicks(smallTick, 60);

//Function for rotating object on Y-axis
function rotateObject(object, angle) {
  const rotationMatrix = new THREE.Matrix3().set(
    Math.cos(angle),
    0,
    Math.sin(angle),
    0,
    1,
    0,
    -Math.sin(angle),
    0,
    Math.cos(angle)
  );
  object.position.applyMatrix3(rotationMatrix);
  object.rotateY(angle);
}

//Function for creating ticks
function createTicks(tick, number) {
  const angle = (2 * Math.PI) / number;
  for (let i = 1; i < number; i++) {
    const ticks = tick.clone();
    rotateObject(ticks, i * angle);
    clockBody.add(ticks);
  }
}

// Scaling and placing clock
const scale = 0.04;
outerRing.scale.set(scale, scale, scale);
outerRing.position.set(
  displayBoardWidth / 2,
  postHeight + boardHeight / 4,
  -(fieldWidth / 2 + wallTickness + postDim)
);
outerRing.position.z += scale;

//Getting time in Hamburg
const time = new Date();
const seconds = time.getSeconds();
const minutes = time.getMinutes();
const hamHours = time.getHours();

//Rotating hands to current time for Hamburg
rotateObject(secHand, -seconds * (Math.PI / 30));
rotateObject(minHand, -(minutes + seconds / 60) * (Math.PI / 30));
rotateObject(
  hrHand,
  -(hamHours + minutes / 60 + seconds / 3600) * (Math.PI / 6)
);

//Rotation intervals
const second = Math.PI / 30;
const minute = second / 60;
const hour = minute / 12;

//Function to start the clock
function startClock() {
  rotateObject(secHand, -second);
  rotateObject(minHand, -minute);
  rotateObject(hrHand, -hour);
}
setInterval(startClock, 1000);

//Adding length counter diplay
// Create a plane geometry as the board
const boardGeometry = new THREE.PlaneGeometry(2, 1);
const boardMaterial = new THREE.MeshPhongMaterial({
  color: "white",
  side: THREE.DoubleSide,
});
const textBoard = new THREE.Mesh(boardGeometry, boardMaterial);
textBoard.position.set(
  displayBoardWidth / 2,
  postHeight - boardHeight / 4,
  -(fieldWidth / 2 + wallTickness + postDim / 2)
);
scene.add(textBoard);

//function fro loading the font
async function loadFont(url) {
  const result = {
    then(resolve, reject) {
      const Loader = new FontLoader();
      Loader.load(
        url,
        (font) => {
          resolve(font);
        },
        undefined,
        (error) => {
          reject(error);
        }
      );
    },
  };
  return await result;
}
let text;
const font = await loadFont(
  "https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/fonts/helvetiker_regular.typeface.json"
);

function displayLength() {
  const lengthText = snakeLength.toString();
  const size = 0.5;
  const texHeight = 0.2;

  if (text) {
    textBoard.remove(text);
  }

  const textGeometry = new TextGeometry(lengthText, {
    font: font,
    size: size,
    height: texHeight,
  });
  const textMaterial = new THREE.MeshPhongMaterial({ color: "black" });
  text = new THREE.Mesh(textGeometry, textMaterial);

  // Position the text geometry on the board
  text.position.x = -size / 2;
  text.position.y = -texHeight;

  textBoard.add(text);
}
displayLength();

const controls = new TrackballControls(camera, renderer.domElement);
controls.noRotate = true;

// Render  loops
function render() {
  requestAnimationFrame(render);
  renderer.setRenderTarget(null);
  renderer.render(scene, camera);
  growSnake();
  renderer.setRenderTarget(renderTarget);
  renderer.render(scene, renderTargetCamera);
  controls.update();
}
render();
