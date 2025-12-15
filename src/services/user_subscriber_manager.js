import UserSubscriber from '@/services/user_subscriber'

class UserSubscriberManager extends EventTarget {
  subscribers = new Map()

  has(pubkey) {
    return this.subscribers.has(pubkey)
  }

  get(pubkey) {
    return this.subscribers.get(pubkey)?.event
  }

  async subscribe(pubkey) {
    if (this.has(pubkey)) {
      return this.get(pubkey)
    }

    const subscriber = new UserSubscriber({
      pubkey,
      onChange: (userEvent) => {
        this.dispatchEvent(new CustomEvent('change', { detail: userEvent }))
      },
    })

    this.subscribers.set(pubkey, subscriber)

    return await subscriber.subscribe()
  }

  getOrSubscribe(pubkey) {
    if (this.has(pubkey)) {
      return this.get(pubkey)
    }

    this.subscribe(pubkey).catch(() => {
      // Ignore to allow this to be called synchronously.
    })

    return null
  }
}

export default new UserSubscriberManager()
