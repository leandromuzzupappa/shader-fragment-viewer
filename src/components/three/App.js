import * as THREE from "three";
import Sizes from "./utils/Sizes";
import Time from "./utils/Time";

import Camera from "./Camera";
import Renderer from "./Renderer";
import Mesh from "./Mesh";

export default class App {
  constructor(_canvas, _fragmentShader) {
    if (App.instance) {
      return App.instance;
    }

    console.log("lenny");

    App.instance = this;

    this.fragmentShader = _fragmentShader;

    this.canvas = _canvas;
    this.scene = new THREE.Scene();

    this.sizes = new Sizes();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.mesh = new Mesh();
    this.time = new Time();

    window.addEventListener("update", () => this.update());
    window.addEventListener("resize", () => this.resize());
  }

  resize() {}
  update() {
    this.renderer.update();
  }
}
