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
        <h1>Shader Fragment Viewer</h1>

        <drop-area></drop-area>
      </div>
    `;
  }
}

customElements.define("shader-fragment-viewer", ShaderViewer);
