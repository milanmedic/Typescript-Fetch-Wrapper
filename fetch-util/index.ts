import { logger } from 'lib/errors'
import GETRequestConfig from './models/requestConfigs/getConfig'
import PUTRequestConfig from './models/requestConfigs/putConfig'
import DELETERequestConfig from './models/requestConfigs/deleteConfig'
import ReqParamsConfig from './models/reqParamsConfig'
import QueryParams from './models/queryParams'
import IRequestConfig from './models/requestConfigs/requestConfig'
import POSTRequestConfig from './models/requestConfigs/postConfig'
import IRequestUtility from '..'

export enum AcceptTypes {
  CSV = 'text/csv',
  JSON = 'application/json',
}
/**
 * Fetch Utility used for communicating with the API. Uses the native fetch API.
 */
export default class FetchUtility implements IRequestUtility {
  private host?: string

  /**
    * Create a Fetch Utility instance.
    * @param {string} host - The endpoint to be targeted.
    * The Fetch Utility will combine the host (e.g. localhost:8080),
    * with the endpoint, and optional query params to create a valid API url.
  */
  constructor(host = '') {
    this.host = host || process.env.NEXT_PUBLIC_HOST
  }

  /**
   * Retrieves the set host.
   * @returns set host
   */
  getHost(): string {
    return this.host || ''
  }

  /**
   * Sets a new host.
   * @param host new host to be set.
   */
  setNewHost(host: string): void {
    this.host = host
  }

  /**
   * Performs a GET request.
   * @param endpoint The endpoint that needs to be targeted.
   * Should be specified without a trailing slash.
   * @param queryParams A map representing all query params for a certain request.
   * @param acceptType Indicates which content types, the client is able to understand.
   * @param token A token used for authentification.
   */
  async get({
    endpoint,
    queryParams, acceptType = '', token = '',
  }: ReqParamsConfig): Promise<unknown> {
    const requestConfig = new GETRequestConfig(acceptType, token)

    let response: unknown = null

    let url = this.formatURL(endpoint)

    if (queryParams) {
      url = FetchUtility.setQueryParameters(url, queryParams)
    }

    try {
      response = await FetchUtility.sendRequest(url, requestConfig)
    } catch (err) {
      let msg = ''
      if (err instanceof Error) msg = err.message
      logger(msg, 'FetchUtility', 'get')
    }

    return response
  }

  /**
   * Performs a POST request.
   * @param endpoint The endpoint that needs to be targeted.
   * Should be specified without a trailing slash.
   * @param queryParams A map representing all query params for a certain request.
   * @param body Body of the request to be sent over to the client.
   * @param token A token used for authentification.
   */
  async post({
    endpoint,
    queryParams, body, token,
  }: ReqParamsConfig): Promise<unknown> {
    const requestConfig = new POSTRequestConfig(body, token)
    let response: unknown = null
    let url = this.formatURL(endpoint)

    if (queryParams) {
      url = FetchUtility.setQueryParameters(url, queryParams)
    }

    try {
      response = await FetchUtility.sendRequest(url, requestConfig)
    } catch (err) {
      let msg = ''
      if (err instanceof Error) msg = err.message
      logger(msg, 'FetchUtility', 'post')
    }

    return response
  }

  /**
   * Performs a PUT request.
   * @param endpoint The endpoint that needs to be targeted.
   * Should be specified without a trailing slash.
   * @param queryParams A map representing all query params for a certain request.
   * @param body Body of the request to be sent over to the client.
   * @param token A token used for authentification.
   */
  async put({
    endpoint,
    queryParams, body, token,
  }: ReqParamsConfig): Promise<unknown> {
    const requestConfig = new PUTRequestConfig(body, token)
    let response: unknown = null
    let url = this.formatURL(endpoint)

    if (queryParams) {
      url = FetchUtility.setQueryParameters(url, queryParams)
    }

    try {
      response = await FetchUtility.sendRequest(url, requestConfig)
    } catch (err) {
      let msg = ''
      if (err instanceof Error) msg = err.message
      logger(msg, 'FetchUtility', 'put')
    }

    return response
  }

  /**
   * Performs a DELETE request.
   * @param endpoint The endpoint that needs to be targeted.
   * Should be specified without a trailing slash.
   * @param queryParams A map representing all query params for a certain request.
   * @param body Body of the request to be sent over to the client.
   * @param token A token used for authentification.
   */
  async delete({
    endpoint, queryParams, token = '',
  }: ReqParamsConfig): Promise<unknown> {
    const requestConfig = new DELETERequestConfig(token)

    let response: unknown = null

    let url = this.formatURL(endpoint)

    if (queryParams) {
      url = FetchUtility.setQueryParameters(url, queryParams)
    }

    try {
      response = await FetchUtility.sendRequest(url, requestConfig)
    } catch (err) {
      let msg = ''
      if (err instanceof Error) msg = err.message
      logger(msg, 'FetchUtility', 'delete')
    }

    return response
  }

  /**
   * Formats the URL with the host and endpoint to produce
   * a URL. E.g. http://localhost:8080/endpoint/
   * @param endpoint Endpoint to be added to the host.
   * @returns A newly formed URL.
   */
  private formatURL(endpoint: string) {
    return `${this.host}/${endpoint}/`
  }

  /**
   * Formats a URL by adding query parameters to id. If the only specified query parameter
   * is an ID, the function will add that ID as a path variable.
   * @param url URL on which the query parameters should be appended to.
   * @param queryParams Query params to be appended to the URL.
   * @returns A URL with all the query params added.
   */
  private static setQueryParameters(url: string, queryParams: QueryParams): string {
    let newUrl = url
    if (queryParams.length() === 1 && queryParams.has('id')) {
      newUrl += `${queryParams.get('id')}`
      return newUrl
    }

    if (!queryParams.empty()) {
      if (newUrl[newUrl.length - 1] === '/') {
        newUrl = newUrl.slice(0, newUrl.length - 1)
      }
      newUrl += '?'
      queryParams.keys().forEach((key: string) => {
        newUrl += `${key}=${queryParams.get(key)}&`
      })

      newUrl = newUrl.slice(0, newUrl.length - 1)
    }
    return newUrl
  }

  /**
   * Sends the actual API request using the Fetch API.
   * @param url URL to be targeted.
   * @param requestConfig Request configuration describing the request.
   * @returns An API response.
   */
  private static async sendRequest(
    url: string, requestConfig: IRequestConfig,
  ): Promise<Response | null> {
    let response: Response = new Response()
    response = await fetch(`${url}`, requestConfig)

    if (response.status >= 400 && response.status <= 600) {
      throw new Error(response.statusText)
    }

    if (requestConfig.headers.get('Accept') === AcceptTypes.CSV) {
      return response
    }

    return response.json()
  }
}
