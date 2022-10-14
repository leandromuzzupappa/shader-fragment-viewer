class ShaderViewer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
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
    this.init();
  }

  init() {
    console.log("init");
  }

  render() {
    this.shadowRoot.innerHTML = /*html*/ `
      <style>${ShaderViewer.styles}</style>
      <div>
        <h1>Shader Fragment Viewer</h1>

        <drop-area></drop-area>
      </div>
    `;
  }
}

customElements.define("shader-fragment-viewer", ShaderViewer);
