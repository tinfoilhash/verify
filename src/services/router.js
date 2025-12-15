import { Router } from '@lit-labs/router'

class THVRouter extends Router {
  navigate(path) {
    window.history.pushState({}, '', path)
    this.goto(path)
  }

  backOrNavigate(path) {
    if (window.history.length > 1) {
      window.history.back()
    } else {
      this.navigate(path)
    }
  }
}

export default THVRouter
