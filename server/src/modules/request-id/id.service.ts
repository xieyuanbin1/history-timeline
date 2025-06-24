import { Injectable } from '@nestjs/common';

@Injectable()
export class IdService {
  private counter = 0;

  next(prefix = 'REQ'): string {
    this.counter += 1;
    if (this.counter > 999999) this.counter = 1;
    return `${prefix}-${this.counter.toString().padStart(6, '0')}`;
  }
}
