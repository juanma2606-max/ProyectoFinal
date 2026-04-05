// componentes/home/home-resume/home-resume.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Huerto } from '../../../modelos/huerto.model';

@Component({
  selector: 'app-home-resume',
  standalone: true,
  imports: [RouterLink], //IMPORTANTE: Añadir RouterLink aquí
  templateUrl: './home-resume.component.html',
  styleUrl: './home-resume.component.scss'
})
export class HomeResumeComponent {
  
  @Input() huerto: Huerto | undefined;
  
  //Especificar el tipo genérico <Huerto> para que $event sea Huerto, no Event
  @Output() edit = new EventEmitter<Huerto>();
  @Output() delete = new EventEmitter<Huerto>();

  constructor(private router: Router) {}

  //Especificar el tipo genérico <Huerto> para que $event sea Huerto, no Event
  onEdit(): void {
    if (this.huerto) {
      this.edit.emit(this.huerto); //Emite Huerto, no Event
    }
  }

  onDelete(): void {
    if (this.huerto) {
      this.delete.emit(this.huerto); //Emite Huerto, no Event
    }
  }

    // Navega a /app/huerto/:id
  onVerHuerto(): void {
    if (this.huerto) this.router.navigate(['/app/huerto', this.huerto.id]);
  }
}