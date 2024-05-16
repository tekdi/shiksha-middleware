import { Request, Response, NextFunction } from 'express';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

@Injectable()
export class MiddlewareServices {
    constructor(private readonly httpService: HttpService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const config = {
                apiMappings: {
                    identifier1: {
                        // microservice: 'http://3.109.46.84:4000',
                        microservice: 'generated_tokenhttp://localhost:3000',
                        endpoint: 'event/v1/{dynamicParam}',
                        permission: 'event-read',
                        method: 'GET'
                    },
                    identifier2: {
                        // microservice: 'http://3.109.46.84:4000',
                        microservice: 'http://localhost:3000',
                        endpoint: 'event/v1/{dynamicParam}',
                        permission: 'event-delete',
                        method: 'DELETE'
                    },
                    identifier3: {
                        // microservice: 'http://3.109.46.84:4000',
                        microservice: 'http://localhost:3000',
                        endpoint: 'event/v1/create',
                        permission: 'event-create',
                        method: 'POST',
                    },
                },
            };

            const originalUrl = req.originalUrl;
            let apiIdentifier: string | undefined;
            let dynamicParam: string | undefined;

            // Extract dynamicParam from the request URL
            const urlParts = originalUrl.split('/');
            dynamicParam = urlParts[urlParts.length - 1];
            for (const key in config.apiMappings) {
                const mapping = config.apiMappings[key];
                const endpointWithParam = mapping.endpoint.replace('{dynamicParam}', dynamicParam);
                if (originalUrl.includes(endpointWithParam) && mapping.method === req.method) {
                    apiIdentifier = key;
                    break;
                }
            }
            if (!apiIdentifier || !dynamicParam) {
                throw new Error('API identifier or dynamic param not found in URL');
            }

            const apiMappings = config.apiMappings;
            const { microservice, port, endpoint } = apiMappings[apiIdentifier];
            let dynamicEndpoint = endpoint.replace('{dynamicParam}', dynamicParam);
            const microserviceUrl = `${microservice}/${dynamicEndpoint}`;
            const response: AxiosResponse = await this.httpService
                .request({
                    method: req.method as any,
                    url: microserviceUrl,
                    data: req.body,
                    // headers: req.headers,
                })
                .toPromise();
            // console.log('Response:', response);
            res.status(response.status).send(response.data);
        } catch (e) {
            if (e.response.status === 404) {
                res.status(404).send({ message: e.response.data });
            }
            else {
                res.status(500).send({ message: 'Internal server error' });
            }
        }
    }
}
