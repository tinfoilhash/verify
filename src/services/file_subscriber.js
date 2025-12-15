import FileEvent from '@/services/file_event'
import relayPool from '@/services/relay_pool'
import userSubscriberManager from '@/services/user_subscriber_manager'

class FileSubscriber {
  static RELAY_URLS = import.meta.env.VITE_FILE_RELAY_URLS?.split(',') ?? []

  hash
  onChange = null
  events = []
  relayPool = relayPool
  userSubscriberManager = this.connectUserSubscriberManager()

  constructor({ hash, onChange = null }) {
    this.hash = hash
    this.onChange = onChange
  }

  connectUserSubscriberManager() {
    userSubscriberManager.addEventListener(
      'change',
      ({ detail: userEvent }) => {
        this.events = this.events.map((fileEvent) => {
          if (fileEvent.pubkey === userEvent.pubkey) {
            fileEvent.userEvent = userEvent
          }

          return fileEvent
        })

        this.onChange?.(this.events)
      },
    )

    return userSubscriberManager
  }

  async subscribe() {
    return await new Promise((resolve, reject) => {
      this.relayPool.subscribeManyEose(
        this.constructor.RELAY_URLS,
        {
          kinds: [FileEvent.KIND],
          '#x': [this.hash],
        },
        {
          onevent: (event) => {
            try {
              const fileEvent = new FileEvent(event)

              fileEvent.userEvent = this.userSubscriberManager.getOrSubscribe(
                fileEvent.pubkey,
              )

              this.events = [...this.events, fileEvent].sort(
                (a, b) => a.createdAt - b.createdAt,
              )

              this.onChange?.(this.events)
            } catch (error) {
              console.error(error)
            }
          },
          onclose: async () => {
            try {
              if (this.relayPool.listConnectionStatus().size === 0) {
                reject(new Error('unable to connect to verify server'))
              } else {
                resolve(this.events)
              }
            } catch (error) {
              console.error(error)
            }
          },
        },
      )
    })
  }
}

export default FileSubscriber
