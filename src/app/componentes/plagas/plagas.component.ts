import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlagasService } from '../../servicios/plagas.service';
import { Plaga } from '../../modelos/plagas';

@Component({
  selector: 'app-plagas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './plagas.component.html'
})
export class PlagasComponent implements OnInit {

  tipoActivo: 'plaga' | 'enfermedad' = 'plaga';
  plagas: Plaga[] = [];

  constructor(private plagasService: PlagasService) {}

  ngOnInit(): void {
    // Cargar todos los datos desde el servicio
    this.plagas = this.plagasService.getTodos();
  }

  get plagasFiltradas(): Plaga[] {
    return this.plagas.filter(p => p.tipo === this.tipoActivo);
  }

  cambiarTipo(tipo: 'plaga' | 'enfermedad'): void {
    this.tipoActivo = tipo;
  }
}