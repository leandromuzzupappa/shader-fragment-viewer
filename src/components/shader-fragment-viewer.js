import * as THREE from "three";

class ShaderViewer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.fragmentShader = null;
  }

  static get styles() {
    return /*css*/ `
      :host {
        display: block;
      }

      canvas {
        width: 100vw;
        height: 100vh;
      }
    `;
  }

  connectedCallback() {
    this.render();

    this.shadowRoot.addEventListener(
      "file-loaded",
      this.onFileDropped.bind(this)
    );
  }

  init() {
    console.log("init");

    /* TODO para el lenny del futuro
      - armar bien la parte de three y persistir
      - poder persistir el shader
      - poder cambiar el shader sin tener que recargar la pagina
      - pensar mas todos 💩
     
    */

    const canvas = this.shadowRoot.querySelector(".pepitos");
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 2;

    const scene = new THREE.Scene();

    const geometry = new THREE.PlaneGeometry(
      window.innerWidth,
      window.innerHeight
    );
    const uresolutionForPlane = /*glsl*/ `
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const uresolutionForBoxes = /*glsl*/`
    //   varying vec2 vUv;
    //   void main()	{
    //     vUv = uv;
    //     gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    //   }
    // `;

    const uniforms = {
      u_resolution: {
        type: "vec2",
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      u_time: { type: "float", value: 1.0 },
      u_mouse: { type: "vec2", value: new THREE.Vector2() },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: uresolutionForPlane,
      fragmentShader: this.fragmentShader,
      uniforms: uniforms,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    function render() {
      uniforms.u_time.value += 0.05;

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }

  onFileDropped(e) {
    const { fileContent } = e.detail;
    if (fileContent) {
      this.fragmentShader = fileContent;

      const dropArea = this.shadowRoot.querySelector("drop-area");
      dropArea.hide();

      this.init();
    }
  }

  render() {
    this.shadowRoot.innerHTML = /*html*/ `
      <style>${ShaderViewer.styles}</style>
      <div class="shader-viewer">
        <canvas class="pepitos"></canvas>

        <drop-area></drop-area>
      </div>
    `;
  }
}

customElements.define("shader-fragment-viewer", ShaderViewer);
