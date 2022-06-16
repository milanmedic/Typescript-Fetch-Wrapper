export default interface IRequestConfig {
  method: string,
  headers: Headers,
  mode?: RequestMode,
  cache?: RequestCache,
  body?: BodyInit,
}
