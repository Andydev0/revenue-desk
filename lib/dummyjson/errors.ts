export class DummyJsonTimeoutError extends Error {
  constructor() {
    super('DummyJSON request timed out')
    this.name = 'DummyJsonTimeoutError'
  }
}

export class DummyJsonUnavailableError extends Error {
  constructor() {
    super('DummyJSON request failed')
    this.name = 'DummyJsonUnavailableError'
  }
}

export class DummyJsonValidationError extends Error {
  constructor() {
    super('DummyJSON returned an invalid response')
    this.name = 'DummyJsonValidationError'
  }
}
