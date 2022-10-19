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

    this.fragmentShader = null;
  }

  connectedCallback() {
    this.render();

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
        <drop-area></drop-area>
        <canvas class="pepitos"></canvas>
      </div>
    `;
  }
}

customElements.define("shader-fragment-viewer", ShaderViewer);
