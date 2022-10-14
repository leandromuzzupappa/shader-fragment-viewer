class DropArea extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.file = null;
    this.msg = "Load fragment shader";
  }

  static get styles() {
    return /*css*/ `
        :host {
          --pantone-winner-2022: #6767ab;

          font-family:  system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          display: block;
          padding: 0;
          margin: 0;
        }

        .drop-area {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,.8);
          display: grid;
          place-items: center;
          
        }

        .drop-zone {
          position: absolute;
          width: 300px;
          height: 300px;
          background: var(--pantone-winner-2022);
          border-radius: 10px;
        }

        .drop-area-status {
          position: relative;
          text-align: center;
          z-index: 1;
          font-size: 1.5rem;
          font-weight: 600;
          color: #fff;
          pointer-events: none;
        }

        .drop-area-hidden {
          display: none;

        }
    `;
  }

  connectedCallback() {
    this.render();
    this.init();
  }

  init() {
    if (!window.FileReader) {
      this.shadowRoot.querySelector(".drop-area-status").textContent =
        "File API not supported";
      return;
    }

    this.dropZone = this.shadowRoot.querySelector(".drop-zone");
    this.dropAreaStatus = this.shadowRoot.querySelector(".drop-area-status");

    this.dropZone.addEventListener("dragover", this.onDragOver.bind(this));
    this.dropZone.addEventListener("drop", this.onFileSelect.bind(this));
  }

  onDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }

  onFileSelect(e) {
    e.stopPropagation();
    e.preventDefault();

    this.handleFileSelected(e.dataTransfer.files[0]);
  }

  handleFileSelected(file) {
    this.file = file;
    this.dropAreaStatus.textContent = file.name;

    const reader = new FileReader();
    reader.onload = this.onFileLoaded.bind(this);
    reader.readAsText(file);
  }

  onFileLoaded(e) {
    const fileContent = e.target.result;

    this.dispatchEvent(
      new CustomEvent("file-loaded", {
        detail: {
          fileContent,
        },
        bubbles: true,
        composed: true,
        cancelable: false,
      })
    );

    /* this.shadowRoot
      .querySelector(".drop-area")
      .classList.add("drop-area-hidden"); */
  }

  show() {
    this.shadowRoot
      .querySelector(".drop-area")
      .classList.remove("drop-area-hidden");

    this.dropAreaStatus.textContent = this.msg;
  }

  hide() {
    this.shadowRoot
      .querySelector(".drop-area")
      .classList.add("drop-area-hidden");
  }

  render() {
    this.shadowRoot.innerHTML = /*html*/ `
        <style>${DropArea.styles}</style>
        <section class="drop-area">
          <span class="drop-area-status">
            ${this.msg}
          </span>
          <div class="drop-zone"></div>
        </section>
    `;
  }
}

customElements.define("drop-area", DropArea);
