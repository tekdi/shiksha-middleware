import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { EventService } from 'src/services/event/event.service';


@Injectable()
export class MiddlewareService {
    constructor(
        private readonly eventService: EventService
    ) {

    }
    async createEvent(requestBody, response: Response) {
        const result = await this.eventService.createEvent(requestBody)
        return response
            .status(HttpStatus.CREATED)
            .send(result);
    }

    async getAllEvent(requestBody, response: Response) {
        const result = await this.eventService.getAllEvent(requestBody)
        return response
            .status(HttpStatus.OK)
            .send(result);
    }

    async getEventById(id, response: Response) {
        const result = await this.eventService.getEventById(id);
        return response
            .status(HttpStatus.OK)
            .send(result);
    }

    async updateEvent(id, requestBody, response) {
        const result = await this.eventService.updateEvent(id, requestBody)
        return response
            .status(HttpStatus.OK)
            .send(result);
    }

    async deleteEvent(id, response: Response) {
        const result = await this.eventService.deleteEvent(id);

        return response
            .status(HttpStatus.OK)
            .send(result);
    }

}
