import { Module } from '@nestjs/common';
import { HachageService } from './hachage.service';
;

@Module({
    imports: [],
    providers: [HachageService],
    exports: [HachageService]
})
export class HachageModule { };