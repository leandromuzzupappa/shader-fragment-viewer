import * as THREE from "three";
import App from "./App";

export default class Camera {
  constructor() {
    this.app = new App();
    this.sizes = this.app.sizes;
    this.scene = this.app.scene;
    this.canvas = this.app.canvas;

    this.createPerspectiveCamera();
  }

  createPerspectiveCamera() {
    this.perspectiveCamera = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.perspectiveCamera.position.z = 2;

    this.scene.add(this.perspectiveCamera);
  }

  resize() {}
  update() {}
}
