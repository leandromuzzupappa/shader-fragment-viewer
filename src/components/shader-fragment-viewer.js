import App from "./three/App";
import * as monaco from "monaco-editor";
import monacoStyles from "../assets/styles/editor.main.css";

class ShaderViewer extends HTMLElement {
  static get styles() {
    return /*css*/ `
      ${monacoStyles}

      :host {
        display: block;
        font-family:  system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      canvas {
        width: 100vw;
        height: 100vh;
      }

      .shader-viewer {
        position: relative;
        width: 100%;
        height: 100vh;
        overflow: hidden;
      }

      .actions {
        position: absolute;
        bottom: 1rem;
        left: 50%;
        translate: -50%;
        background: rgba(255, 255, 255, .8);
        border-radius: .3rem;
        backdrop-filter: blur(3px);
        padding: .5rem 1rem;
        text-align: center;
        opacity: .5;
        transition: opacity .3s ease;
      }

      .actions:hover {
        opacity: 1;
      }

      .actions h2 {
        font-size: 1.2rem;
        margin: 0;
        margin-bottom: .5rem;

      }

      .actions ul {
        list-style: none;
        display: flex;
        gap: 1rem;
      }

      .shader-edit {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(0%);
        width: 100%;
        max-width: 40vw;
        height: 100vh;
        background: #fff;
        padding: 1rem;
      }

      .shader-edit h2 {
        margin-bottom: 1rem;
      }


      .shader-edit.hidden {
        transform: translate(100%);
      }

      .shader-edit button {
        position: absolute;
        top: 1rem;
        right: 1rem;
        border: 0;
        background: transparent;
        font-size: 1rem;
        cursor: pointer;
      }

      .shader-edit .editor {
        position: relative;
        left: 0;
        width: 100%;
        height: 95%;
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
  }

  init() {
    const canvas = this.shadowRoot.querySelector("canvas");
    this.app = new App(canvas, this.fragmentShader);

    this.dropArea = this.shadowRoot.querySelector("drop-area");
    this.editShaderBtn = this.shadowRoot.querySelector(".edit-shader--btn");
    this.loadShaderBtn = this.shadowRoot.querySelector(".load-shader--btn");
    this.editPanel = this.shadowRoot.querySelector(".shader-edit");
    this.closeEditPannel = this.shadowRoot.querySelector(".shader-edit--btn");

    this.editShaderBtn.addEventListener(
      "click",
      this.toggleEditPanel.bind(this)
    );
    this.closeEditPannel.addEventListener(
      "click",
      this.toggleEditPanel.bind(this)
    );

    this.initMonaco();

    this.loadShaderBtn.addEventListener("click", () => this.dropArea.show());
  }

  onFileDropped(e) {
    const { fileContent } = e.detail;
    if (fileContent) {
      this.fragmentShader = fileContent;

      const dropArea = this.shadowRoot.querySelector("drop-area");
      dropArea.hide();

      if (!this.app) {
        this.init();
      } else {
        this.app.mesh.updateFragment(this.fragmentShader);
      }

      // this.textarea.value = this.fragmentShader;
    }
  }

  toggleEditPanel() {
    this.editPanel.classList.toggle("hidden");
  }

  onEditShader(e) {
    const { value } = e.target;
    this.fragmentShader = value;

    this.app.mesh.updateFragment(this.fragmentShader);
  }

  initMonaco() {
    const editor = monaco.editor.create(
      this.shadowRoot.querySelector(".editor"),
      {
        value: this.fragmentShader,
        language: "glsl",
        theme: "vs-dark",
      }
    );

    console.log(editor);

    // listen for changes in code
    editor.onDidChangeModelContent((e) => {
      const value = editor.getValue();
      this.fragmentShader = value;

      this.app.mesh.updateFragment(this.fragmentShader);
    });
  }

  render() {
    this.shadowRoot.innerHTML = /*html*/ `
      <style>${ShaderViewer.styles}</style>
      <div class="shader-viewer">
      <drop-area></drop-area>
        
        <div class="actions">
          <h2>Actions</h2>
          <ul>
            <li><button class="edit-shader--btn">Edit shader</button></li>
            <li><button class="load-shader--btn">Load shader</button></li>
          </ul>
        </div>

        <section class="shader-edit hidden">
          <h2>Edit shader</h2>
          <button class="shader-edit--btn">
            X
          </button>
          
          <div class="editor"></div>
        </section>
        
        <canvas class="pepitos"></canvas>
      </div>
    `;
  }
}

customElements.define("shader-fragment-viewer", ShaderViewer);
