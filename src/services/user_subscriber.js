import relayPool from '@/services/relay_pool'
import UserEvent from '@/services/user_event'

class UserSubscriber {
  static RELAY_URLS = import.meta.env.VITE_USER_RELAY_URLS?.split(',') ?? []

  pubkey
  onChange = null
  event = null
  relayPool = relayPool
  promise = null

  constructor({ pubkey, onChange = null }) {
    this.pubkey = pubkey
    this.onChange = onChange
  }

  async subscribe() {
    this.promise ||= new Promise((resolve) => {
      this.relayPool.subscribeManyEose(
        this.constructor.RELAY_URLS,
        {
          kinds: [UserEvent.KIND],
          authors: [this.pubkey],
        },
        {
          onevent: (event) => {
            try {
              const userEvent = new UserEvent(event)

              if (!this.event || userEvent.createdAt > this.event.createdAt) {
                this.event = userEvent

                this.onChange?.(userEvent)
              }
            } catch (error) {
              console.error(error)
            }
          },
          onclose: () => {
            resolve(this.event)
          },
        },
      )
    })

    return await this.promise
  }
}

export default UserSubscriber
