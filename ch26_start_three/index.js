let theShader;

function setup() {
  // 建立canvas，並指定使用WEBGL
  createCanvas(windowWidth, windowHeight, WEBGL);

  // load vert/frag defined below
  theShader = createShader(vertex, fragment);

  // 螢幕像素固定為1物理像素
  pixelDensity(1);
}

function draw() {
  // 傳送參數給Shader
  theShader.setUniform("u_resolution", [windowWidth, windowHeight]);

  theShader.setUniform("u_time", frameCount * 0.01);
  // 每次渲染幀(frame)時套用Shader
  shader(theShader);
  // 利用p5.js的rect()建立一個矩形，這個矩形將被shader拿來處理
  rect(0, 0, windowWidth, windowHeight);
}

const vertex = document.getElementById("vertexShader").innerHTML;
const fragment = document.getElementById("fragmentShader").innerHTML;
