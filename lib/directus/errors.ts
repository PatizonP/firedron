export class DirectusFetchError extends Error {
  readonly status?: number;
  readonly path?: string;

  constructor(message: string, status?: number, path?: string) {
    super(message);
    this.name = "DirectusFetchError";
    this.status = status;
    this.path = path;
  }
}

export class DirectusContentError extends Error {
  readonly collection?: string;

  constructor(message: string, collection?: string) {
    super(message);
    this.name = "DirectusContentError";
    this.collection = collection;
  }
}
