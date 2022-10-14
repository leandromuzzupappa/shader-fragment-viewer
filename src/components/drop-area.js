class DropArea extends HTMLElement {
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

  init() {}

  render() {
    this.shadowRoot.innerHTML = /*html*/ `
        <style>${DropArea.styles}</style>
        <div>
            <h1>Drop Area</h1>
        </div>
    `;
  }
}

customElements.define("drop-area", DropArea);
