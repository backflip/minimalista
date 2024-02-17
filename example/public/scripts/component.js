import html from "./html.js";

export default class Component extends HTMLElement {
  async connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });

    const response = await fetch("/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hello: "world" }),
    }).then((response) => response.json());

    shadow.innerHTML = html`<pre>${JSON.stringify(response, null, 2)}</pre>`;
  }
}

customElements.define("my-component", Component);
