import ReqParamsConfig from './fetch-util/models/reqParamsConfig'

export default interface IRequestUtility {
  get: (reqParamsConfig: ReqParamsConfig) => Promise<unknown>;
  post: (reqParamsConfig: ReqParamsConfig) => Promise<unknown>;
  put: (reqParamsConfig: ReqParamsConfig) => Promise<unknown>;
  delete: (reqParamsConfig: ReqParamsConfig) => Promise<unknown>;
  getHost: () => string;
  setNewHost: (host: string) => void;
}
