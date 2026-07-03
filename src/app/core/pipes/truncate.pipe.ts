import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, length: number = 100, suffix: string = '...'): string {
    if (!value) {
      return '';
    }

    return value.length > length ? value.slice(0, length).trimEnd() + suffix : value;
  }
}
