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

    App.instance = this;

    this.fragmentShader = _fragmentShader;

    this.canvas = _canvas;
    this.scene = new THREE.Scene();
    this.time = new Time();
    this.sizes = new Sizes();

    this.camera = new Camera();
    this.mesh = new Mesh();
    this.renderer = new Renderer();

    window.addEventListener("update", () => this.update());
    window.addEventListener("resize", () => this.resize());
  }

  resize() {}
  update() {
    this.renderer.update();
    this.mesh.update();
  }
}
