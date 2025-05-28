import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {

    generateReference(prefix: string, count: number) {
        return `${prefix}-${count}-${Date.now().toString()}`;
    }
}
