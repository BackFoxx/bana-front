import axios, {AxiosError, AxiosResponse, Method} from "axios";
import {instanceToPlain, plainToInstance} from "class-transformer";
import HttpError from "@/repository/HttpError";
import * as queryString from "querystring";
import {singleton} from "tsyringe";

@singleton()
export default class AxiosClient {
    private readonly client = axios.create({
        timeout: 15000,
    })

    public get<T>(path: string, params: any = null, clazz: { new (...args: any) }): Promise<T> {
        return this.requestREST('GET', path, params).then((response) => {
            return plainToInstance(clazz, response)
        })
    }

    public getOptional<T>(path: string, params: any = null, clazz: { new (...args: any) }): Promise<T | null> {
        return this.requestREST('GET', path, params).then((response) => {
            if (response) {
                return plainToInstance(clazz, response)
            }
            return null
        })
    }

    public post<T>(path: string, params: any = null, body: any = null, clazz: { new (...args: any) }): Promise<T> {
        return this.requestREST('POST', path, params, body).then((response) => {
            return plainToInstance(clazz, response)
        })
    }

    public patch<T>(path: string, params: any = null, body: any = null, clazz: { new (...args: any) }): Promise<T> {
        return this.requestREST('PATCH', path, params, body).then((response) => {
            return plainToInstance(clazz, response)
        })
    }

    public delete<T>(path: string, params: any = null): Promise<T> {
        return this.requestREST('DELETE', path)
    }

    public deleteWithBody<T>(path: string, params: any = null, body: any = null): Promise<T> {
        return this.requestREST('DELETE', path, params, body)
    }

    private requestREST(method: Method, path: string, params: any = null, body: any = undefined): Promise<any> {
        const url = AxiosClient.appendParams(path, params)
        if (typeof body === 'object') {
            body = instanceToPlain(body)
        }

        return this.request(method, url, {}, body)
    }

    public requestMultipart(
        method: Method,
        path: string,
        params: any = null,
        file: File,
        clazz: new () => any,
        progress: ((e) => void) | null = null
    ): Promise<any> {
        const url = AxiosClient.appendParams(path, params)

        const headers = {
            'Content-Type': 'multipart/form-data',
        }

        const form = new FormData()
        form.append('file', file)

        const config = { method: method, url: url, data: form, headers: headers }
        if (progress !== null) {
            config['onUploadProgress'] = progress
        }

        return this.client
            .request(config)
            .then((r: AxiosResponse) => {
                return plainToInstance(clazz, r.data)
            })
            .catch((e: AxiosError) => {
                console.error(e)
                throw new HttpError(e)
            })
    }

    public request(method: Method, url: string, headers = {}, body: any = undefined) {
        const config = {method: method, url: url, data: body, headers: headers};

        return this.client
            .request(config)
            .then((r: AxiosResponse) => {
                return r.data
            })
            .catch((e: AxiosError) => {
                console.error(e)
                throw new HttpError(e)
            })
    }

    private static appendParams(path: string, params: any = null) {
        return params !== null ? `${path}?${queryString.stringify(params).toString()}` : path
    }
};