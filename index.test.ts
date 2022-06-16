import GETRequestConfig from './fetch-util/models/requestConfigs/getConfig'
import FetchUtility, { AcceptTypes } from './fetch-util'
import QueryParams from './fetch-util/models/queryParams'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const global: any // Has to be set to any in order for us to be able to spy on fetch

afterEach(() => {
  jest.clearAllMocks()
})

test('should set new host', () => {
  const fetchUtil = new FetchUtility('')
  const host = 'localhost:3000/'
  fetchUtil.setNewHost(host)
  expect(fetchUtil.getHost()).toBe(`${host}`)
})

test('should send request to url', () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue('OK'),
    status: 200,
  })

  const fetchUtil = new FetchUtility('')
  const endpoint = 'helloworld'

  const queryParams = new QueryParams()
  queryParams.set('id', 1)
  const requestConfig = new GETRequestConfig()

  return fetchUtil.get({
    endpoint,
    queryParams,
  }).then(() => {
    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_HOST}/helloworld/1`,
      requestConfig,
    )
  })
})

test('should form a correct url using the provided query parameters', () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue('OK'),
    status: 200,
  })

  const fetchUtil = new FetchUtility('')
  const endpoint = 'helloworld'
  const queryParams = new QueryParams()
  queryParams.set('name', 'Jane')
  queryParams.set('surname', 'Doe')
  const requestConfig = new GETRequestConfig()

  return fetchUtil.get({
    endpoint,
    queryParams,
  }).then(() => {
    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_HOST}/helloworld?name=Jane&surname=Doe`,
      requestConfig,
    )
  })
})

test('should perform a successful GET request.', () => {
  interface SuccessGet {
    id: number
  }
  const response = { id: 1 }
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue(response),
    status: 200,
  })

  const fetchUtil = new FetchUtility('')
  return fetchUtil.get({
    endpoint: '',
    acceptType: AcceptTypes.JSON,
  }).then((resp: unknown) => {
    expect((resp as SuccessGet).id).toBe(1)
  })
})

test('should perform a unsuccessful GET request.', () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue({}),
    status: 500,
  })

  const fetchUtil = new FetchUtility('')
  return fetchUtil.get({
    endpoint: '',
    acceptType: AcceptTypes.JSON,
  }).then((resp: unknown) => {
    expect(resp).toBeFalsy()
  })
})

test('should perform a successful POST request.', () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    status: 200,
    json: jest.fn().mockResolvedValue('OK'),
  })

  const fetchUtil = new FetchUtility('')
  return fetchUtil.post({
    endpoint: '',
    acceptType: AcceptTypes.JSON,
    body: {},
  }).then((resp: unknown) => {
    expect(resp).toBeTruthy()
  })
})

test('should perform a unsuccessful POST request.', () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ status: 500 })

  const fetchUtil = new FetchUtility('')
  return fetchUtil.post({
    endpoint: '',
    acceptType: AcceptTypes.JSON,
    body: {},
  }).then((resp: unknown) => {
    expect(resp).toBeFalsy()
  })
})

test('should perform a successful PUT request.', () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    status: 200,
    json: jest.fn().mockResolvedValue('OK'),
  })

  const fetchUtil = new FetchUtility('')
  return fetchUtil.put({
    endpoint: '',
    body: {},
  }).then((resp: unknown) => {
    expect(resp).toBeTruthy()
  })
})

test('should perform a unsuccessful PUT request.', () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ status: 500 })

  const fetchUtil = new FetchUtility('')
  return fetchUtil.put({
    endpoint: '',
    acceptType: AcceptTypes.JSON,
    body: {},
  }).then((resp: unknown) => {
    expect(resp).toBeFalsy()
  })
})

test('should perform a successful DELETE request.', () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue('Deleted'),
    status: 204,
  })

  const fetchUtil = new FetchUtility('')
  const queryParams = new QueryParams()
  queryParams.set('id', 1)
  return fetchUtil.delete({
    endpoint: '',
    queryParams,
  }).then((resp: unknown) => {
    expect(resp).toBeTruthy()
  })
})

test('should perform a unsuccessful DELETE request.', () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue({}),
    status: 500,
  })

  const fetchUtil = new FetchUtility('')
  return fetchUtil.delete({ endpoint: '' }).then((resp: unknown) => {
    expect(resp).toBeFalsy()
  })
})
