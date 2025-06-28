import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseJsonPipe implements PipeTransform {
  constructor(private readonly keys: string[]) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) return value;

    this.keys.forEach((key) => {
      if (value[key] && typeof value[key] === 'string') {
        try {
          value[key] = JSON.parse(value[key]);
        } catch {
          throw new BadRequestException(`Le champ '${key}' doit être un JSON valide`);
        }
      }
    });

    return value;
  }
}
