import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class NotEmptyStringPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (Boolean(value)) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
}
