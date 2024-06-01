import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellipse',
})
export class EllipsePipe implements PipeTransform {
  transform(srt: unknown, N?: number): string | void {
    if (typeof srt === 'string') {
      return srt.trim().slice(0, N || 5) + '...';
    }
  }
}
