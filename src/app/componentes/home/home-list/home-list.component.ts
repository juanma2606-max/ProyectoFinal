// huerto-list.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Huerto } from '../../../modelos/huerto.model';
import { HuertosService } from '../../../servicios/huertos.service';
import { HomeResumeComponent } from '../home-resume/home-resume.component';

@Component({
  selector: 'app-home-list',
  standalone: true,
  imports: [CommonModule, HomeResumeComponent],
  templateUrl: './home-list.component.html',
  styleUrl: './home-list.component.scss'
})
export class HomeListComponent implements OnInit {
  
  huertos$!: Observable<Huerto[]>;
  huertoAEliminar: Huerto | null = null;

  @ViewChild('deleteModal') deleteModal!: ElementRef;

  constructor(
    private huertoService: HuertosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.huertos$ = this.huertoService.getAllHuertosFirebase();
  }

  onEditHuerto(huerto: Huerto): void {
    // Redirigir al formulario de edición
    const ruta = huerto.tipo === 'parcela' ? '/app/huerto/editar' : '/app/maceta/editar';
    this.router.navigate([ruta], { queryParams: { id: huerto.id } });
  }

  confirmarEliminacion(): void {
    if (this.huertoAEliminar) {
      this.huertoService.removeObject(this.huertoAEliminar.id)
        .then(() => {
          console.log('Huerto eliminado correctamente');
          this.huertoAEliminar = null;
        })
        .catch(error => {
          console.error('Error al eliminar:', error);
        });
    }
  }
}