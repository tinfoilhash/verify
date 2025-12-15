import CurrentUser from '@/services/current_user'
import FollowListEvent from '@/services/follow_list_event'
import FollowListSubscriber from '@/services/follow_list_subscriber'
import UserEvent from '@/services/user_event'
import userSubscriberManager from '@/services/user_subscriber_manager'

class CurrentUserConnection extends EventTarget {
  static STORAGE_KEY = 'currentUser'
  static REFRESH_AFTER_MS = 1000 * 60 * 60

  static STATUSES = {
    UNINITIALIZED: 'UNINITIALIZED',
    DISCONNECTED: 'DISCONNECTED',
    PENDING: 'PENDING',
    CONNECTED: 'CONNECTED',
    ERROR: 'ERROR',
  }

  status = this.constructor.STATUSES.UNINITIALIZED
  currentUser = null
  error = null

  get canConnect() {
    return Boolean(
      window.nostr || window.localStorage.getItem(this.constructor.STORAGE_KEY),
    )
  }

  get isPending() {
    return this.status === this.constructor.STATUSES.PENDING
  }

  dispatchChange({ status, currentUser = null, error = null }) {
    this.status = status
    this.currentUser = currentUser
    this.error = error

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          status,
          currentUser,
          error,
        },
      }),
    )

    return currentUser
  }

  shouldRefresh(currentUser) {
    return (
      currentUser.requestedAt <= Date.now() - this.constructor.REFRESH_AFTER_MS
    )
  }

  loadFromStorage() {
    const serialized = window.localStorage.getItem(this.constructor.STORAGE_KEY)

    if (!serialized) {
      return null
    }

    const parsed = JSON.parse(serialized)

    return new CurrentUser({
      ...parsed,
      userEvent: new UserEvent(parsed.userEvent),
      followListEvent: new FollowListEvent(parsed.followListEvent),
    })
  }

  saveToStorage(currentUser) {
    return window.localStorage.setItem(
      this.constructor.STORAGE_KEY,
      JSON.stringify(currentUser),
    )
  }

  removeFromStorage() {
    return window.localStorage.removeItem(this.constructor.STORAGE_KEY)
  }

  async getUserEvent(pubkey, currentUser = null) {
    const userEvent = await userSubscriberManager.subscribe(pubkey)

    if (!userEvent) {
      return currentUser?.userEvent
    }

    return userEvent
  }

  async getFollowListEvent(pubkey, currentUser = null) {
    const followListEvent = await new FollowListSubscriber({
      pubkey,
    }).subscribe()

    if (!followListEvent) {
      return currentUser?.followListEvent
    }

    return followListEvent
  }

  async connect({
    pubkey = null,
    canAskForPubkey = false,
    ignoreNoPubkeyError = false,
  } = {}) {
    try {
      if (pubkey && pubkey === this.currentUser?.pubkey) {
        return this.currentUser
      }

      this.dispatchChange({ status: this.constructor.STATUSES.PENDING })

      let currentUser

      if (!pubkey) {
        if (!this.canConnect) {
          if (ignoreNoPubkeyError) {
            return this.dispatchChange({
              status: this.constructor.STATUSES.DISCONNECTED,
            })
          }

          throw new Error('unable to connect without nostr browser extension')
        }

        currentUser = this.loadFromStorage()

        if (currentUser && !this.shouldRefresh(currentUser)) {
          return this.dispatchChange({
            status: this.constructor.STATUSES.CONNECTED,
            currentUser,
          })
        }

        pubkey = currentUser?.pubkey

        if (!pubkey) {
          if (!canAskForPubkey) {
            if (ignoreNoPubkeyError) {
              return this.dispatchChange({
                status: this.constructor.STATUSES.DISCONNECTED,
              })
            }

            throw new Error('unable to connect without pubkey')
          }

          pubkey = await window.nostr.getPublicKey()
        }
      }

      const userEvent = await this.getUserEvent(pubkey, currentUser)

      if (!userEvent) {
        throw new Error('unable to find your profile')
      }

      const followListEvent = await this.getFollowListEvent(pubkey, currentUser)

      if (!followListEvent) {
        throw new Error('unable to find who you follow')
      }

      currentUser = new CurrentUser({ userEvent, followListEvent })

      this.saveToStorage(currentUser)

      return this.dispatchChange({
        status: this.constructor.STATUSES.CONNECTED,
        currentUser,
      })
    } catch (error) {
      return this.dispatchChange({
        status: this.constructor.STATUSES.ERROR,
        error,
      })
    }
  }

  disconnect() {
    this.removeFromStorage()

    return this.dispatchChange({
      status: this.constructor.STATUSES.DISCONNECTED,
    })
  }
}

export default new CurrentUserConnection()
