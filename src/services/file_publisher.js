import currentUserConnection from '@/services/current_user_connection'
import FileEvent from '@/services/file_event'
import relayPool from '@/services/relay_pool'

class FilePublisher {
  static RELAY_URLS = import.meta.env.VITE_FILE_RELAY_URLS?.split(',') ?? []

  file
  description
  url
  relayPool = relayPool

  constructor({ file, description, url }) {
    this.file = file
    this.description = description
    this.url = url
  }

  async publish() {
    const event = await window.nostr.signEvent({
      kind: FileEvent.KIND,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ['x', this.file.hash],
        ['m', this.file.type],
        ['size', this.file.size.toString()],
        ['url', this.url],
      ],
      content: this.description,
    })

    await Promise.all(
      this.relayPool.publish(this.constructor.RELAY_URLS, event),
    )

    const fileEvent = new FileEvent(event)

    this.file.publishedFileEvent = fileEvent

    currentUserConnection.connect({ pubkey: fileEvent.pubkey })

    return fileEvent
  }
}

export default FilePublisher
