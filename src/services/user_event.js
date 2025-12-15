import NostrEvent from '@/services/nostr_event'

class UserEvent extends NostrEvent {
  static KIND = 0

  parseContent(content) {
    return JSON.parse(content)
  }

  get displayName() {
    return (
      this.content.display_name ??
      this.content.name ??
      this.pubkeyEncodedTruncated
    )
  }

  get picture() {
    return this.content.picture
  }
}

export default UserEvent
