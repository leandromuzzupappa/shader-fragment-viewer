class DropArea extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.file = this.getStoredFile();
    this.msg = "No file selected";
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

          position: fixed;
          font-family:  system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          display: grid;
          width: 100%;
          min-height: 100vh;
          place-items: center;
          background: transparent;
          color: var(--clr-neutral-900);
          z-index: 1;
        }

        .modal {
          display: block;
          width: 100%;
          max-width: 550px;
          padding: 1.5rem;
          background: var(--clr-neutral-100);
          border-radius: 1rem;
        }

        :host(.hidden) {
          display: none;
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

        .modal main input {
          display: none;
        }

        .modal main label {
          cursor: pointer;
          color: var(--clr-blue-500);
          text-decoration: underline;
        }

        .modal footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
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

        .modal footer button[disabled] {
          opacity: 0.5;
          cursor: not-allowed;
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
      this.shadowRoot.querySelector(".drop-zone").innerHTML =
        "<h3>File API not supported</h3>";
      return;
    }

    this.modal = this.shadowRoot.querySelector(".modal");
    this.dropZone = this.shadowRoot.querySelector(".drop-zone");
    this.dropZoneUpload = this.shadowRoot.querySelector("#drop-zone-upload");
    this.dropAreaStatus = this.shadowRoot.querySelector(".drop-info-status");
    this.confirmBtn = this.shadowRoot.querySelector("button");
    this.persistFile = this.shadowRoot.querySelector("#drop-persist");

    this.dropZone.addEventListener("dragover", this.onDragOver.bind(this));
    this.dropZone.addEventListener("drop", this.onFileSelect.bind(this));
    this.confirmBtn.addEventListener("click", this.onConfirm.bind(this));
    this.dropZoneUpload.addEventListener(
      "change",
      this.onFileUpload.bind(this)
    );

    if (this.file) {
      this.dropAreaStatus.textContent = this.file.name;
      this.confirmBtn.removeAttribute("disabled");
      this.persistFile.removeAttribute("disabled");
      this.persistFile.checked = true;
    }
  }

  onFileUpload(e) {
    e.stopPropagation();
    e.preventDefault();

    this.handleFileSelected(e.target.files[0]);
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
    this.file.data = e.target.result;
    this.confirmBtn.removeAttribute("disabled");
    this.persistFile.removeAttribute("disabled");
  }

  handleStoreFile() {
    const key = "shadercito";

    if (this.persistFile.checked) {
      const file = {
        name: this.file.name,
        data: this.file.data,
      };

      localStorage.setItem(key, JSON.stringify(file));
    } else {
      localStorage.removeItem(key);
    }
  }

  getStoredFile() {
    const key = "shadercito";

    const file = localStorage.getItem(key);

    if (file) {
      const { name, data } = JSON.parse(file);

      return { name, data };
    }

    return null;
  }

  onConfirm() {
    if (!this.file && !this.file?.data) return;

    this.handleStoreFile();

    this.dispatchEvent(
      new CustomEvent("file-loaded", {
        detail: {
          fileContent: this.file.data,
        },
        bubbles: true,
        composed: true,
        cancelable: false,
      })
    );

    this.classList.add("hidden");
  }

  show() {
    this.classList.remove("hidden");
    this.dropAreaStatus.textContent = this.msg;
  }

  hide() {
    this.classList.add("hidden");
  }

  render() {
    this.shadowRoot.innerHTML = /*html*/ `
        <style>${DropArea.styles}</style>
        <section class="modal">
          <header>
            <h2>Attach your fragment shader</h2>
          </header>
          <main id="modal-main" role="main">
            
            <section class="drop-zone">
              <h3>Drop file area</h3>
              <p>
                <label for="drop-zone-upload">Click to upload</label> or drag and drop your fragment shader

                <input type="file" id="drop-zone-upload" />
              </p>
            </section>
            <section class="drop-info">
              <h3>File info</h3>
              <p class="drop-info-status">${this.msg}</p>
            </section>

          </main>
          <footer>
            <span class="drop-persist">
              <input type="checkbox" id="drop-persist" disabled />
              <label for="drop-persist">Persist file in browser</label>
            </span>
            <button disabled>Use file</button>
          </footer>
          
        </section>
    `;
  }
}

customElements.define("drop-area", DropArea);
