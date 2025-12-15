import cssNormalize from '@/components/base/css/css_normalize'
import { css, html, LitElement } from 'lit'

class THVAppHeader extends LitElement {
  render() {
    return html`
      <header>
        <a href="/">
          <h1>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;018<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fe572<br />&nbsp;&nbsp;&nbsp;&nbsp;eb8b00b<br />&nbsp;&nbsp;&nbsp;c72e95fd9<br />&nbsp;&nbsp;c1<span
              class="th"
              >tinfoil</span
            >5c<br />&nbsp;003<span class="th">hash</span
            >501bf3<br />05b2fd9e3223ffc
          </h1>
        </a>
      </header>
    `
  }

  static styles = [
    cssNormalize,
    css`
      :host {
        display: block;
      }

      header {
        display: flex;
        margin-bottom: 2rem;
      }

      header a {
        text-decoration: none;
      }

      header a h1 {
        margin: 0;
        font-size: inherit;
        font-weight: inherit;
        line-height: 1.25rem;
        color: var(--thv-color-700);
        letter-spacing: 0.25rem;
      }

      header a h1 .th {
        color: var(--thv-color-100);
      }

      @media (width >= 40rem) {
        header {
          margin-bottom: 4rem;
        }
      }
    `,
  ]
}

customElements.define('thv-app-header', THVAppHeader)

export default THVAppHeader
