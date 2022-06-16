import IRequestConfig from '../requestConfig'

export default class DELETEConfig implements IRequestConfig {
  method: string

  headers: Headers

  mode?: RequestMode | undefined

  cache?: RequestCache | undefined

  constructor(token?: string) {
    this.method = 'DELETE'

    const headers: HeadersInit = new Headers()

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    this.headers = headers
    this.mode = 'cors' as RequestMode
    this.cache = 'no-cache' as RequestCache
  }
}
