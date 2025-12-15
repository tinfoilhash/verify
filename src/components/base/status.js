import cssNormalize from '@/components/base/css/css_normalize'
import { css, html, LitElement } from 'lit'

class THVStatus extends LitElement {
  static properties = {
    color: { type: String },
  }

  render() {
    return html`<slot></slot>`
  }

  static styles = [
    cssNormalize,
    css`
      :host {
        display: block;
        padding: 0.75rem;
        font-size: 1.25rem;
      }

      :host([color='red']) {
        background: var(--thv-color-red);
      }

      :host([color='orange']) {
        background: var(--thv-color-orange);
      }

      :host([color='green']) {
        background: var(--thv-color-green);
      }

      ::slotted(a) {
        color: inherit;
        text-decoration: none;
        border-bottom: 2px solid var(--thv-color-100);
      }

      ::slotted(strong) {
        font-weight: 600;
      }
    `,
  ]
}

customElements.define('thv-status', THVStatus)

export default THVStatus
