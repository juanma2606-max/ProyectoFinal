import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Huerto } from '../../../modelos/huerto.model';
import { HuertosService } from '../../../servicios/huertos.service';

@Component({
  selector: 'app-home-resume',
  standalone: true,
  imports: [],
  templateUrl: './home-resume.component.html',
  styleUrl: './home-resume.component.scss'
})
export class HomeResumeComponent {
  
  @Input() huerto: Huerto | undefined;
  
  @Output() edit = new EventEmitter<Huerto>();
  @Output() delete = new EventEmitter<Huerto>();

  private huertosService = inject(HuertosService);

  constructor(private router: Router) {}

  /**
   * Obtener URL completa de la foto del huerto
   */
  getFotoHuertoUrl(): string {
    return this.huertosService.getFotoHuertoUrl(this.huerto?.foto);
  }

  onCardClick(): void {
    if (this.huerto?.id) {
      this.router.navigate(['/app/huerto', this.huerto.id]);
    }
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    if (this.huerto) {
      this.edit.emit(this.huerto);
    }
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    if (this.huerto) {
      this.delete.emit(this.huerto);
    }
  }
}