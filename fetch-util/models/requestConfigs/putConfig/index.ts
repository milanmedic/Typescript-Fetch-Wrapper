import IRequestConfig from '../requestConfig'

export default class PUTConfig implements IRequestConfig {
  method: string

  headers: Headers

  mode?: RequestMode | undefined

  cache?: RequestCache | undefined

  body?: BodyInit

  constructor(body: unknown, token?: string) {
    this.method = 'PUT'

    const headers: HeadersInit = new Headers()
    headers.set('Content-Type', 'application/json')

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    this.headers = headers
    this.mode = 'cors' as RequestMode
    this.cache = 'no-cache' as RequestCache
    this.body = JSON.stringify(body)
  }
}
