import { Module } from '@nestjs/common';
import { HachageService } from './hachage.service';
;

@Module({
    imports:[],
    providers:[HachageService]
})
export class HachageModule{};