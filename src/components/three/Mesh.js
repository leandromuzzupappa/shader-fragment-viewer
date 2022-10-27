import * as THREE from "three";
import App from "./App";

import vertexShader from "./shaders/plane.vertex.glsl?raw";

export default class Mesh {
  constructor() {
    this.app = new App();
    this.sizes = this.app.sizes;
    this.scene = this.app.scene;
    this.fragmentShader = this.app.fragmentShader;
    this.time = this.app.time;

    this.setPlane();
    window.addEventListener("mousemove", (event) => this.onMouseMove(event));
  }

  setPlane() {
    this.geometry = new THREE.PlaneGeometry(
      this.sizes.width.toFixed(2),
      this.sizes.height.toFixed(2)
    );

    this.vertexShader = vertexShader;
    this.uniforms = {
      u_resolution: {
        type: "vec2",
        value: new THREE.Vector2(
          this.sizes.width.toFixed(2),
          this.sizes.height.toFixed(2)
        ),
      },
      u_time: { type: "float", value: 1.0 },
      u_mouse: { type: "vec2", value: new THREE.Vector2() },
    };

    this.material = new THREE.ShaderMaterial({
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      uniforms: this.uniforms,
    });

    this.setMesh();
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  onMouseMove(event) {
    this.uniforms.u_mouse.value.x = event.clientX;
    this.uniforms.u_mouse.value.y = event.clientY;
  }

  updateFragment(fragment) {
    this.material.fragmentShader = fragment;
    this.material.needsUpdate = true;
  }

  update() {
    this.uniforms.u_time.value += this.time.delta * 0.0005;
  }
}
