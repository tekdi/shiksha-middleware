import { Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, ParseUUIDPipe, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { MiddlewareService } from './middleware.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/common/middleware/jwt-auth.guard';

@ApiTags('middleware')
@Controller('')
export class MiddlewareController {

    constructor(
        private readonly middlewareService: MiddlewareService
    ) { }

    @Post('event/v1/create')
    @ApiBasicAuth("access-token")
    @UseGuards(JwtAuthGuard)
    @ApiBody({
        type: Object
    })
    async create(@Body() requestBody: any, @Res() response: Response) {
        return this.middlewareService.createEvent(requestBody, response);
    }

    @Post('event/v1/list')
    @ApiBody({
        type: Object
    })
    async getAllEvent(@Body() requestBody, @Res() response: Response): Promise<any> {
        return this.middlewareService.getAllEvent(requestBody, response);
    }

    @Get('event/v1/:id')
    @ApiBasicAuth("access-token")
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id', ParseUUIDPipe) id: string, @Res() response: Response) {
        return this.middlewareService.getEventById(id, response);
    }

    @Patch('event/v1/:id')
    @ApiBody({
        type: Object
    })
    updateEvent(@Param('id', ParseUUIDPipe) id: string, @Body() requestBody, @Res() response: Response): Promise<any> {
        return this.middlewareService.updateEvent(id, requestBody, response)
    }

    @Delete('event/v1/:id')
    deleteEvent(@Param('id', ParseUUIDPipe) id: string, @Res() response: Response) {
        return this.middlewareService.deleteEvent(id, response)
    }

}
