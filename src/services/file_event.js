import NostrEvent from '@/services/nostr_event'

class FileEvent extends NostrEvent {
  static KIND = 1063

  userEvent = null

  get userDisplayName() {
    return this.userEvent?.displayName ?? this.pubkeyEncodedTruncated
  }
}

export default FileEvent
