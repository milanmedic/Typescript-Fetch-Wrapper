import IRequestConfig from '../requestConfig'

export default class GETConfig implements IRequestConfig {
  method: string

  headers: Headers

  mode?: RequestMode | undefined

  cache?: RequestCache | undefined

  constructor(acceptType?: string, token?: string) {
    this.method = 'GET'

    const headers: HeadersInit = new Headers()
    if (acceptType) {
      headers.set('Accept-Type', acceptType)
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    this.headers = headers
    this.mode = 'cors' as RequestMode
    this.cache = 'no-cache' as RequestCache
  }
}
