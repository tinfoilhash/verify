const THVNavigable = (superClass) =>
  class THVNavigableElement extends superClass {
    navigate(url, { back = false } = {}) {
      this.dispatchEvent(
        new CustomEvent('thv-navigate', {
          detail: { url, back },
          bubbles: true,
          composed: true,
        }),
      )
    }
  }

export default THVNavigable
