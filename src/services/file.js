class THVFile {
  file
  hash
  publishedFileEvent = null

  constructor({ file, hash }) {
    this.file = file
    this.hash = hash
  }

  static async build(file) {
    return new this({
      file,
      hash: await this.hash(file),
    })
  }

  static async hash(file) {
    const hashBuffer = await crypto.subtle.digest(
      'SHA-256',
      await file.arrayBuffer(),
    )

    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }

  get name() {
    return this.file.name
  }

  get type() {
    return this.file.type
  }

  get size() {
    return this.file.size
  }

  get hasBeenPublished() {
    return Boolean(this.publishedFileEvent)
  }
}

export default THVFile
