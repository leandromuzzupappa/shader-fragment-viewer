class DropArea extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.file = null;
    this.msg = "Load fragment shader";
  }

  static get styles() {
    return /*css*/ `

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :host {
          --pantone-winner-2022: #6767ab;
          --clr-neutral-100: #ffffff;
          --clr-neutral-200: #f5f5f5;
          --clr-neutral-300: #e0e0e0;
          --clr-neutral-800: #333333;
          --clr-neutral-900: #1a1a1a;
          --clr-blue-500: #3153cb;
          --clr-blue-800: #15266f;
          --clr-blue-900: #111e5e;
          --clr-peach-500: #fea858;

          font-family:  system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          display: grid;
          width: 100%;
          min-height: 100vh;
          place-items: center;
          background: var(--clr-blue-900);
          color: var(--clr-neutral-900);
        }

        .modal {
          display: block;
          width: 100%;
          max-width: 550px;
          padding: 1.5rem;
          background: var(--clr-neutral-100);
          border-radius: 1rem;
        }

        .modal header,
        .modal main {
          margin-bottom: 2rem;
        }

        .modal header h2 {
          font-size: 1.5rem;
          font-weight: 500;
        }

        .modal main section:nth-child(1) {
          margin: 1rem 0;
        }

        .modal main h3 {
          font-size: 1.25rem;
          font-weight: 500;
        }

        .modal main p {
          font-size: 1rem;
          font-weight: 400;
        }

        .modal footer {
          display: flex;
          justify-content: flex-end;
          border-top: 1px solid var(--clr-neutral-300);
          padding-top: 1rem;
        }

        .modal footer button {
          padding: 0.5rem 1rem;
          background: var(--clr-blue-500);
          color: var(--clr-neutral-100);
          border: none;
          border-radius: 0.25rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
        }

        .modal footer button:hover {
          background: var(--clr-blue-800);
        }

        .modal footer button:active {
          background: var(--clr-blue-900);
        }

        .drop-zone {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 200px;
          border: 2px dashed var(--clr-peach-500);
          border-radius: 0.25rem;
          cursor: pointer;
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
        <section class="modal modal-drop">
          <header>
            <h2>Attach your fragment shader</h2>
          </header>
          <main id="modal-main" role="main">
            
            <section class="drop-zone">
              <h3>Drop file area</h3>
              <p>
                <a href="#">Click to upload</a> or drag and drop your fragment shader
              </p>
            </section>
            <section class="drop-info">
              <h3>File info</h3>
            </section>

          </main>
          <footer>
            <button>Use file</button>
          </footer>
          
        </section>
    `;
  }
}

customElements.define("drop-area", DropArea);
