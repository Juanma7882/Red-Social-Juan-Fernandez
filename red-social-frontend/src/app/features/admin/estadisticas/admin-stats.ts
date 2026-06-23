import { AfterViewInit, Component, ElementRef, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';
import { NestAdminService } from '../../../core/services/nest.admin.service';
import { StatCommentsByPost, StatCommentsOverTime, StatPostsByUser } from '../../../core/models/admin.models';

@Component({
  selector: 'app-admin-stats',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-stats.html',
})
export class AdminStats implements AfterViewInit, OnDestroy {
  private adminService = inject(NestAdminService);

  @ViewChild('chartPostsByUser') chartPostsByUserRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartCommentsTime') chartCommentsTimeRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('chartCommentsByPost') chartCommentsByPostRef!: ElementRef<HTMLCanvasElement>;

  private charts: Chart[] = [];

  loading = signal(false);
  error = signal<string | null>(null);

  fromDate = this.defaultFrom();
  toDate = new Date().toISOString().split('T')[0];

  private defaultFrom(): string {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  }

  async ngAfterViewInit() {
    await this.loadStats();
  }

  async loadStats() {
    this.loading.set(true);
    this.error.set(null);
    this.destroyCharts();

    try {
      const [postsByUser, commentsOverTime, commentsByPost] = await Promise.all([
        this.adminService.getPostsByUser(this.fromDate, this.toDate),
        this.adminService.getCommentsOverTime(this.fromDate, this.toDate),
        this.adminService.getCommentsByPost(this.fromDate, this.toDate),
      ]);

      this.loading.set(false);
      setTimeout(() => {
        this.renderPostsByUser(postsByUser);
        this.renderCommentsOverTime(commentsOverTime);
        this.renderCommentsByPost(commentsByPost);
      }, 0);
    } catch {
      this.error.set('Error al cargar estadísticas. Verificá el rango de fechas.');
      this.loading.set(false);
    }
  }

  private renderPostsByUser(data: StatPostsByUser[]) {
    console.log(data);
    const chart = new Chart(this.chartPostsByUserRef.nativeElement, {
      type: 'bar',
      data: {
        labels: data.map((d) => d.username),
        datasets: [
          {
            label: 'Publicaciones',
            data: data.map((d) => d.total),
            backgroundColor: 'rgba(251, 191, 36, 0.75)',
            borderColor: 'rgba(251, 191, 36, 1)',
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: this.chartOptions('Publicaciones por usuario'),
    });
    this.charts.push(chart);
  }

  private renderCommentsOverTime(data: StatCommentsOverTime[]) {
    const chart = new Chart(this.chartCommentsTimeRef.nativeElement, {
      type: 'line',
      data: {
        labels: data.map((d) => d.fecha),
        datasets: [
          {
            label: 'Comentarios',
            data: data.map((d) => d.total),
            borderColor: 'rgba(99, 202, 183, 1)',
            backgroundColor: 'rgba(99, 202, 183, 0.15)',
            borderWidth: 2,
            pointRadius: 4,
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: this.chartOptions('Comentarios por día'),
    });
    this.charts.push(chart);
  }

  private renderCommentsByPost(data: StatCommentsByPost[]) {
    const chart = new Chart(this.chartCommentsByPostRef.nativeElement, {
      type: 'bar',
      data: {
        labels: data.map((d) => (d.titulo.length > 25 ? d.titulo.slice(0, 25) + '…' : d.titulo)),
        datasets: [
          {
            label: 'Comentarios',
            data: data.map((d) => d.total),
            backgroundColor: 'rgba(139, 92, 246, 0.75)',
            borderColor: 'rgba(139, 92, 246, 1)',
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        ...this.chartOptions('Comentarios por publicación (top 10)'),
        indexAxis: 'y' as const,
      },
    });
    this.charts.push(chart);
  }

  private chartOptions(title: string) {
    return {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: title,
          color: '#e2e8f0',
          font: { size: 13 },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: '#94a3b8', precision: 0 },
          grid: { color: 'rgba(51,65,85,0.6)' },
        },
        x: {
          ticks: { color: '#94a3b8' },
          grid: { color: 'rgba(51,65,85,0.6)' },
        },
      },
    };
  }

  private destroyCharts() {
    this.charts.forEach((c) => c.destroy());
    this.charts = [];
  }

  ngOnDestroy() {
    this.destroyCharts();
  }
}
