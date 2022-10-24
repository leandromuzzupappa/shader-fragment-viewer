import App from "./three/App";

class ShaderViewer extends HTMLElement {
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

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.fragmentShader = this.zzzzzz();
  }

  zzzzzz() {
    return `#ifdef GL_ES
    precision mediump float;
    #endif
    uniform vec2 u_resolution;uniform float u_time;const int ammount = 12;void main() {vec2 coord = 20.0 * (gl_FragCoord.xy - u_resolution / 2.0) / min(u_resolution.y, u_resolution.x);float len;for(int i = 0; i < ammount; i++){len = length(vec2(coord.x, coord.y));coord.x = coord.x - cos(coord.y + sin(len)) + cos(u_time / 9.0);coord.y = coord.y + sin(coord.x + cos(len)) + sin(u_time / 12.0);}gl_FragColor = vec4(cos(len * 2.3), cos(len - .3), cos(len - .1), 1.1);}`;
  }

  connectedCallback() {
    this.render();
    this.init();

    this.shadowRoot.addEventListener(
      "file-loaded",
      this.onFileDropped.bind(this)
    );

    document.addEventListener("keydown", (e) => {
      if (e.key === "o") {
        const dropArea = this.shadowRoot.querySelector("drop-area");
        dropArea.show();
      }
    });
  }

  init() {
    const canvas = this.shadowRoot.querySelector("canvas");
    this.app = new App(canvas, this.fragmentShader);
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
        <drop-area class="hidden"></drop-area>
        <canvas class="pepitos"></canvas>
      </div>
    `;
  }
}

customElements.define("shader-fragment-viewer", ShaderViewer);
