export default class QueryParams {
  private params: Map<string, unknown>

  constructor() {
    this.params = new Map<string, unknown>()
  }

  get(prop: string): unknown {
    return this.params.get(prop)
  }

  set(prop: string, val: unknown): void {
    this.params.set(prop, val)
  }

  length(): number {
    return this.params.size
  }

  has(prop: string): boolean {
    return this.params.has(prop)
  }

  empty(): boolean {
    return this.length() <= 0
  }

  keys(): string[] {
    return Array.from(this.params.keys())
  }
}
