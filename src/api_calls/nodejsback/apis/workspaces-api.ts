/* tslint:disable */
/* eslint-disable */
/**
 * Red Matter
 * API configuration
 *
 * OpenAPI spec version: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import globalAxios, { AxiosPromise, AxiosInstance } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
import { Body3 } from '../models';
import { InlineResponse2002 } from '../models';
import { InlineResponse2004 } from '../models';
import { InlineResponse2005 } from '../models';
import { InlineResponse4001 } from '../models';
/**
 * WorkspacesApi - axios parameter creator
 * @export
 */
export const WorkspacesApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * To get workspaces, OrganisationId is passed in params
         * @summary Getting Workspaces
         * @param {string} organisationId Organisation Id of logged in user
         * @param {string} token token is passed in header
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        appWorkspace: async (organisationId: string, token: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'organisationId' is not null or undefined
            if (organisationId === null || organisationId === undefined) {
                throw new RequiredError('organisationId','Required parameter organisationId was null or undefined when calling appWorkspace.');
            }
            // verify required parameter 'token' is not null or undefined
            if (token === null || token === undefined) {
                throw new RequiredError('token','Required parameter token was null or undefined when calling appWorkspace.');
            }
            const localVarPath = `/api/workspaces`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (organisationId !== undefined) {
                localVarQueryParameter['organisationId'] = organisationId;
            }

            if (token !== undefined && token !== null) {
                localVarHeaderParameter['token'] = String(token);
            }

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * To create Workspace, we need to pass organisationId,workspace name and isPrivate in body of request
         * @summary Creating Workspaces
         * @param {string} token Generate token and pass it in header
         * @param {Body3} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createWorkspace: async (token: string, body?: Body3, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'token' is not null or undefined
            if (token === null || token === undefined) {
                throw new RequiredError('token','Required parameter token was null or undefined when calling createWorkspace.');
            }
            const localVarPath = `/api/create/workspace`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (token !== undefined && token !== null) {
                localVarHeaderParameter['token'] = String(token);
            }

            localVarHeaderParameter['Content-Type'] = 'application/json';

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            const needsSerialization = (typeof body !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.data =  needsSerialization ? JSON.stringify(body !== undefined ? body : {}) : (body || "");

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * To delete workspace, we need to pass workspaceId and workspaceName as query parameters
         * @summary Deleting Workspaces
         * @param {string} workspaceId WorkspaceId
         * @param {string} token Generate token and pass it in header
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteWorkspace: async (workspaceId: string, token: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'workspaceId' is not null or undefined
            if (workspaceId === null || workspaceId === undefined) {
                throw new RequiredError('workspaceId','Required parameter workspaceId was null or undefined when calling deleteWorkspace.');
            }
            // verify required parameter 'token' is not null or undefined
            if (token === null || token === undefined) {
                throw new RequiredError('token','Required parameter token was null or undefined when calling deleteWorkspace.');
            }
            const localVarPath = `/api/workspace/delete`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (workspaceId !== undefined) {
                localVarQueryParameter['workspaceId'] = workspaceId;
            }

            if (token !== undefined && token !== null) {
                localVarHeaderParameter['token'] = String(token);
            }

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * To edit workspace, we need to pass workspaceId and workspaceName as query parameters
         * @summary Editing Workspaces
         * @param {string} workspaceId WorkspaceId
         * @param {string} workspaceName workspaceName
         * @param {string} token Generate token and pass it in header
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        editWorkspace: async (workspaceId: string, workspaceName: string, token: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'workspaceId' is not null or undefined
            if (workspaceId === null || workspaceId === undefined) {
                throw new RequiredError('workspaceId','Required parameter workspaceId was null or undefined when calling editWorkspace.');
            }
            // verify required parameter 'workspaceName' is not null or undefined
            if (workspaceName === null || workspaceName === undefined) {
                throw new RequiredError('workspaceName','Required parameter workspaceName was null or undefined when calling editWorkspace.');
            }
            // verify required parameter 'token' is not null or undefined
            if (token === null || token === undefined) {
                throw new RequiredError('token','Required parameter token was null or undefined when calling editWorkspace.');
            }
            const localVarPath = `/api/workspace/edit`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (workspaceId !== undefined) {
                localVarQueryParameter['workspaceId'] = workspaceId;
            }

            if (workspaceName !== undefined) {
                localVarQueryParameter['workspaceName'] = workspaceName;
            }

            if (token !== undefined && token !== null) {
                localVarHeaderParameter['token'] = String(token);
            }

            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * WorkspacesApi - functional programming interface
 * @export
 */
export const WorkspacesApiFp = function(configuration?: Configuration) {
    return {
        /**
         * To get workspaces, OrganisationId is passed in params
         * @summary Getting Workspaces
         * @param {string} organisationId Organisation Id of logged in user
         * @param {string} token token is passed in header
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async appWorkspace(organisationId: string, token: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<InlineResponse2002>> {
            const localVarAxiosArgs = await WorkspacesApiAxiosParamCreator(configuration).appWorkspace(organisationId, token, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * To create Workspace, we need to pass organisationId,workspace name and isPrivate in body of request
         * @summary Creating Workspaces
         * @param {string} token Generate token and pass it in header
         * @param {Body3} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createWorkspace(token: string, body?: Body3, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<InlineResponse2004>> {
            const localVarAxiosArgs = await WorkspacesApiAxiosParamCreator(configuration).createWorkspace(token, body, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * To delete workspace, we need to pass workspaceId and workspaceName as query parameters
         * @summary Deleting Workspaces
         * @param {string} workspaceId WorkspaceId
         * @param {string} token Generate token and pass it in header
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async deleteWorkspace(workspaceId: string, token: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<InlineResponse2005>> {
            const localVarAxiosArgs = await WorkspacesApiAxiosParamCreator(configuration).deleteWorkspace(workspaceId, token, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * To edit workspace, we need to pass workspaceId and workspaceName as query parameters
         * @summary Editing Workspaces
         * @param {string} workspaceId WorkspaceId
         * @param {string} workspaceName workspaceName
         * @param {string} token Generate token and pass it in header
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async editWorkspace(workspaceId: string, workspaceName: string, token: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<InlineResponse2005>> {
            const localVarAxiosArgs = await WorkspacesApiAxiosParamCreator(configuration).editWorkspace(workspaceId, workspaceName, token, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * WorkspacesApi - factory interface
 * @export
 */
export const WorkspacesApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * To get workspaces, OrganisationId is passed in params
         * @summary Getting Workspaces
         * @param {string} organisationId Organisation Id of logged in user
         * @param {string} token token is passed in header
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        appWorkspace(organisationId: string, token: string, options?: any): AxiosPromise<InlineResponse2002> {
            return WorkspacesApiFp(configuration).appWorkspace(organisationId, token, options).then((request) => request(axios, basePath));
        },
        /**
         * To create Workspace, we need to pass organisationId,workspace name and isPrivate in body of request
         * @summary Creating Workspaces
         * @param {string} token Generate token and pass it in header
         * @param {Body3} [body] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createWorkspace(token: string, body?: Body3, options?: any): AxiosPromise<InlineResponse2004> {
            return WorkspacesApiFp(configuration).createWorkspace(token, body, options).then((request) => request(axios, basePath));
        },
        /**
         * To delete workspace, we need to pass workspaceId and workspaceName as query parameters
         * @summary Deleting Workspaces
         * @param {string} workspaceId WorkspaceId
         * @param {string} token Generate token and pass it in header
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteWorkspace(workspaceId: string, token: string, options?: any): AxiosPromise<InlineResponse2005> {
            return WorkspacesApiFp(configuration).deleteWorkspace(workspaceId, token, options).then((request) => request(axios, basePath));
        },
        /**
         * To edit workspace, we need to pass workspaceId and workspaceName as query parameters
         * @summary Editing Workspaces
         * @param {string} workspaceId WorkspaceId
         * @param {string} workspaceName workspaceName
         * @param {string} token Generate token and pass it in header
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        editWorkspace(workspaceId: string, workspaceName: string, token: string, options?: any): AxiosPromise<InlineResponse2005> {
            return WorkspacesApiFp(configuration).editWorkspace(workspaceId, workspaceName, token, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * WorkspacesApi - object-oriented interface
 * @export
 * @class WorkspacesApi
 * @extends {BaseAPI}
 */
export class WorkspacesApi extends BaseAPI {
    /**
     * To get workspaces, OrganisationId is passed in params
     * @summary Getting Workspaces
     * @param {string} organisationId Organisation Id of logged in user
     * @param {string} token token is passed in header
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WorkspacesApi
     */
    public appWorkspace(organisationId: string, token: string, options?: any) {
        return WorkspacesApiFp(this.configuration).appWorkspace(organisationId, token, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * To create Workspace, we need to pass organisationId,workspace name and isPrivate in body of request
     * @summary Creating Workspaces
     * @param {string} token Generate token and pass it in header
     * @param {Body3} [body] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WorkspacesApi
     */
    public createWorkspace(token: string, body?: Body3, options?: any) {
        return WorkspacesApiFp(this.configuration).createWorkspace(token, body, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * To delete workspace, we need to pass workspaceId and workspaceName as query parameters
     * @summary Deleting Workspaces
     * @param {string} workspaceId WorkspaceId
     * @param {string} token Generate token and pass it in header
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WorkspacesApi
     */
    public deleteWorkspace(workspaceId: string, token: string, options?: any) {
        return WorkspacesApiFp(this.configuration).deleteWorkspace(workspaceId, token, options).then((request) => request(this.axios, this.basePath));
    }
    /**
     * To edit workspace, we need to pass workspaceId and workspaceName as query parameters
     * @summary Editing Workspaces
     * @param {string} workspaceId WorkspaceId
     * @param {string} workspaceName workspaceName
     * @param {string} token Generate token and pass it in header
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof WorkspacesApi
     */
    public editWorkspace(workspaceId: string, workspaceName: string, token: string, options?: any) {
        return WorkspacesApiFp(this.configuration).editWorkspace(workspaceId, workspaceName, token, options).then((request) => request(this.axios, this.basePath));
    }
}
