import FollowListEvent from '@/services/follow_list_event'
import relayPool from '@/services/relay_pool'

class FollowListSubscriber {
  static RELAY_URLS = import.meta.env.VITE_USER_RELAY_URLS?.split(',') ?? []

  pubkey
  onChange = null
  event = null
  relayPool = relayPool

  constructor({ pubkey, onChange = null }) {
    this.pubkey = pubkey
    this.onChange = onChange
  }

  async subscribe() {
    return await new Promise((resolve) => {
      this.relayPool.subscribeManyEose(
        this.constructor.RELAY_URLS,
        {
          kinds: [FollowListEvent.KIND],
          authors: [this.pubkey],
        },
        {
          onevent: (event) => {
            try {
              const followListEvent = new FollowListEvent(event)

              if (
                !this.event ||
                followListEvent.createdAt > this.event.createdAt
              ) {
                this.event = followListEvent

                this.onChange?.(followListEvent)
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
  }
}

export default FollowListSubscriber
