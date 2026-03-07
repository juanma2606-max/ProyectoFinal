import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlantasService } from '../../servicios/plantas.service';
import { Planta } from '../../modelos/planta';

@Component({
  selector: 'app-plantas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './planta.component.html'
})
export class PlantasComponent implements OnInit {

  tipoActivo: Planta['tipo'] | null = null;
  plantas: Planta[] = [];

  constructor(private plantasService: PlantasService) {}

  ngOnInit(): void {
    // Cargar todos los datos desde el servicio
    this.plantasService.getAllPlantasFirebase().subscribe(data => this.plantas = data);
  }

  get plantasFiltradas(): Planta[] {
    return this.tipoActivo
      ? this.plantas.filter(p => p.tipo === this.tipoActivo)
      : this.plantas;
  }

  seleccionarTipo(tipo: Planta['tipo'] | null): void {
    this.tipoActivo = tipo;
  }
}