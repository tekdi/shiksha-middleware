import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, ParseUUIDPipe, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { EventMiddlewareService } from './event.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/common/middleware/jwt-auth.guard';
import { Permissions } from 'src/common/decorator/permission.decorator';

@ApiTags('Event-Middleware')
@Controller('event/v1')
export class EventController {

    constructor(
        private readonly middlewareService: EventMiddlewareService
    ) { }

    @Post('/create')
    @ApiBasicAuth("access-token")
    @UseGuards(JwtAuthGuard)
    @ApiBody({
        type: Object
    })
    async create(@Body() requestBody: any, @Res() response: Response) {
        return this.middlewareService.createEvent(requestBody, response);
    }

    @Post('/list')
    @ApiBody({
        type: Object
    })
    async getAllEvent(@Body() requestBody, @Res() response: Response): Promise<any> {
        return this.middlewareService.getAllEvent(requestBody, response);
    }

    @Get('/:id')
    @ApiBasicAuth("access-token")
    @Permissions('event.read', 'event.create')
    @UseGuards(JwtAuthGuard)
    async findOne(@Req() req, @Param('id', ParseUUIDPipe) id: string, @Res() response: Response) {
        // console.log(req.user, "user");
        return this.middlewareService.getEventById(id, response);
    }

    @Patch('/:id')
    @ApiBody({
        type: Object
    })
    updateEvent(@Param('id', ParseUUIDPipe) id: string, @Body() requestBody, @Res() response: Response): Promise<any> {
        return this.middlewareService.updateEvent(id, requestBody, response)
    }

    @Delete('/:id')
    deleteEvent(@Param('id', ParseUUIDPipe) id: string, @Res() response: Response) {
        return this.middlewareService.deleteEvent(id, response)
    }

}
