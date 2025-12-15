import '@/components/publish/publish'
import '@/components/start/start'
import '@/components/verify/verify'
import { html } from 'lit'

function thvAppRoutes() {
  return [
    {
      path: '/',
      render: () => html`<thv-start></thv-start>`,
    },
    {
      path: '/publish',
      render: () => html`<thv-publish .file=${this._file}></thv-publish>`,
    },
    {
      path: '/:hash',
      render: ({ hash }) => html`
        <thv-verify
          .currentUser=${this._currentUser}
          .file=${this._file}
          .hash=${hash}
        ></thv-verify>
      `,
    },
  ]
}

export default thvAppRoutes
