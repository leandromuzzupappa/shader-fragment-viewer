import * as THREE from "three";
import App from "./App";

export default class Renderer {
  constructor() {
    this.app = new App();
    this.sizes = this.app.sizes;
    this.canvas = this.app.canvas;
    this.scene = this.app.scene;
    this.camera = this.app.camera;

    this.setRenderer();
  }

  setRenderer() {
    if (!this.canvas) return;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
    });

    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.CineonToneMapping;
    this.renderer.toneMappingExposure = 1.75;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(this.sizes.pixelRatio);
  }

  resize() {}

  update() {
    console.log(1);
    this.renderer.render(this.scene, this.camera.perspectiveCamera);
  }
}
