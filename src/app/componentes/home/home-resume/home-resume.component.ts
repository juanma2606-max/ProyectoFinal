// componentes/home/home-resume/home-resume.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router'; // ✅ Necesario para routerLink
import { Huerto } from '../../../modelos/huerto.model';

@Component({
  selector: 'app-home-resume',
  standalone: true,
  imports: [RouterLink], // ✅ IMPORTANTE: Añadir RouterLink aquí
  templateUrl: './home-resume.component.html',
  styleUrl: './home-resume.component.scss'
})
export class HomeResumeComponent {
  
  @Input() huerto: Huerto | undefined;
  
  // ✅ Especificar el tipo genérico <Huerto> para que $event sea Huerto, no Event
  @Output() edit = new EventEmitter<Huerto>();
  @Output() delete = new EventEmitter<Huerto>();

  // ✅ Métodos que emiten el evento con el huerto correcto
  onEdit(): void {
    if (this.huerto) {
      this.edit.emit(this.huerto); // ✅ Emite Huerto, no Event
    }
  }

  onDelete(): void {
    if (this.huerto) {
      this.delete.emit(this.huerto); // ✅ Emite Huerto, no Event
    }
  }
}