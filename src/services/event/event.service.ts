import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class EventService {
    constructor(
        private readonly httpService: HttpService,
    ) { }

    async createEvent(requestBody) {
        const url = process.env.EVENT_URL + 'event/v1/create';
        var data = JSON.stringify(requestBody);
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            const observable = this.httpService.post(url, data, config);
            const promise = observable.toPromise();
            const response = await promise;
            return response.data
        } catch (e) {
            return e.response.data
        }
    }

    async getEventById(id) {
        const url = process.env.EVENT_URL + 'event/v1/' + id;
        try {
            const observable = this.httpService.get(url);
            const promise = observable.toPromise();
            const response = await promise;
            return response.data
        } catch (e) {
            if (e.response.status === 404) {
                return e.response.data
            }
            return e.response;
        }
    }

    async getAllEvent(requestBody) {
        try {
            const url = process.env.EVENT_URL + 'event/v1/list';
            const config: AxiosRequestConfig = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const observable = this.httpService.post(url, requestBody, config);
            const promise = observable.toPromise();
            const response = await promise;
            return response.data;
        } catch (e) {
            if (e.response.status === 404) {
                return e.response.data
            }
            return e.response;
        }
    }

    async updateEvent(id, requestBody) {
        const url = process.env.EVENT_URL + 'event/v1/' + id;
        var data = JSON.stringify(requestBody);
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        let response_list = null;
        try {
            const observable = this.httpService.patch(url, data, config);
            const promise = observable.toPromise();
            const response = await promise;
            return response.data;
        } catch (e) {
            if (e.response.status === 404) {
                return e.response.data
            }
            return e.response;
        }
    }

    async deleteEvent(id) {
        try {
            const url = process.env.EVENT_URL + 'event/v1/' + id;

            const observable = this.httpService.delete(url);
            const promise = observable.toPromise();
            const response = await promise;
            return response.data
        } catch (e) {
            if (e.response.status === 404) {
                console.log(e.response.data);
                return e.response.data
            }
            return e.response;
        }
    }
}
