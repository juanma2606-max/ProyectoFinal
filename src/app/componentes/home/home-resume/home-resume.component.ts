// componentes/home/home-resume/home-resume.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Huerto } from '../../../modelos/huerto.model';
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

  constructor(private router: Router) {}

  // Al hacer clic en la card, navega al detalle del huerto
  onCardClick(): void {
    if (this.huerto?.id) {
      this.router.navigate(['/app/huerto', this.huerto.id]);
    }
  }

  // Editar huerto (sin navegar)
  onEdit(event: Event): void {
    event.stopPropagation(); // Evita que se active onCardClick
    if (this.huerto) {
      this.edit.emit(this.huerto);
    }
  }

  // Eliminar huerto (sin navegar)
  onDelete(event: Event): void {
    event.stopPropagation(); // Evita que se active onCardClick
    if (this.huerto) {
      this.delete.emit(this.huerto);
    }
  }
}