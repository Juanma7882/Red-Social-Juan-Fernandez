import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'relativeDate', standalone: true })
export class RelativeDatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return String(value);

    const diffMs = Date.now() - date.getTime();
    const s = Math.floor(diffMs / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    const mo = Math.floor(d / 30);
    const y = Math.floor(d / 365);

    if (s < 60) return 'hace un momento';
    if (m < 60) return `hace ${m} ${m === 1 ? 'minuto' : 'minutos'}`;
    if (h < 24) return `hace ${h} ${h === 1 ? 'hora' : 'horas'}`;
    if (d < 30) return `hace ${d} ${d === 1 ? 'día' : 'días'}`;
    if (mo < 12) return `hace ${mo} ${mo === 1 ? 'mes' : 'meses'}`;
    return `hace ${y} ${y === 1 ? 'año' : 'años'}`;
  }
}
