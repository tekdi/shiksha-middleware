import { Request, Response, NextFunction } from 'express';
import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { apiMappings } from './apiConfig';

@Injectable()
export class MiddlewareServices {
    constructor() { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            const originalUrl = req.originalUrl;
            let apiIdentifier: string | undefined;
            let dynamicParam: string | undefined;

            // Extract dynamicParam from the request URL
            const urlParts = originalUrl.split('/');
            dynamicParam = urlParts[urlParts.length - 1];

            // Find the matching API mapping
            for (const key in apiMappings) {
                const mapping = apiMappings[key];
                const endpointWithParam = mapping.endpoint.replace('{dynamicParam}', dynamicParam);
                if (originalUrl.includes(endpointWithParam) && mapping.method === req.method) {
                    apiIdentifier = key;
                    break;
                }
            }

            if (!apiIdentifier || !dynamicParam) {
                throw new Error('Invalid Url');
            }

            const { microservice, endpoint } = apiMappings[apiIdentifier];
            const dynamicEndpoint = endpoint.replace('{dynamicParam}', dynamicParam);
            const microserviceUrl = `${microservice}/${dynamicEndpoint}`;

            const response: AxiosResponse = await axios({
                method: req.method as any,
                url: microserviceUrl,
                data: req.body,
                // headers: req.headers,
            });

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
