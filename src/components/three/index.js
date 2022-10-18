import * as THREE from "three";
import Sizes from "./utils/Sizes";
import Camera from "./Camera";

export default class App {
  constructor(_canvas) {
    if (App.get_instance()) {
      return App.get_instance();
    }

    this.canvas = _canvas;
    this.scene = new THREE();

    this.sizes = new Sizes();
    this.camera = new Camera();
  }

  resize() {}
  update() {}
}
