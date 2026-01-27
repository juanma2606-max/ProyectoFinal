import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlantasListaComponent } from '../plantas-lista/plantas-lista.component';
import { Planta } from '../../modelos/planta';

@Component({
  selector: 'app-plantas',
  standalone: true,
  imports: [
    CommonModule,
    PlantasListaComponent
  ],
  templateUrl: './plantas.component.html'
})
export class PlantasComponent {

  plantaActiva: Planta | null = null;

  onPlantaSeleccionada(planta: Planta): void {
    console.log('Planta recibida en padre:', planta);
    this.plantaActiva = planta;
  }
}
