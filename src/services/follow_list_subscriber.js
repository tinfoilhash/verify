import FollowListEvent from '@/services/follow_list_event'
import relayPool, { USER_RELAY_URLS } from '@/services/relay_pool'

class FollowListSubscriber {
  pubkey
  onChange = null
  event = null

  constructor({ pubkey, onChange = null }) {
    this.pubkey = pubkey
    this.onChange = onChange
  }

  async subscribe() {
    return await new Promise((resolve) => {
      relayPool.subscribeManyEose(
        USER_RELAY_URLS,
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
