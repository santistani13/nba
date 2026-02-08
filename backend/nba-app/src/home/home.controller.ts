import { Controller, Get, UseGuards } from '@nestjs/common';
import { HomeService } from './home.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('home')
export class HomeController {
    constructor(private homeService: HomeService){}
    @UseGuards(JwtAuthGuard)
    @Get('overview') 
    getOverview(){
        return this.homeService.getOverview();
    }
}
