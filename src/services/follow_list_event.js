import NostrEvent from '@/services/nostr_event'

class FollowListEvent extends NostrEvent {
  static KIND = 3

  pubkeys = this.mapPubkeys()

  mapPubkeys() {
    if (!this.tags.has('p')) {
      return []
    }

    return this.tags.get('p').map(([pubkey]) => pubkey)
  }

  includes(pubkey) {
    return this.pubkeys.includes(pubkey)
  }
}

export default FollowListEvent
