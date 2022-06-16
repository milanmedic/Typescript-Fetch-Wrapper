import QueryParams from './queryParams'

export default interface ReqParamsConfig {
  endpoint: string,
  queryParams?: QueryParams,
  token?: string,
  acceptType?: string,
  body?: Record<string, unknown>
}
