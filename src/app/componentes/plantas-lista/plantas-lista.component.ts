import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Planta } from '../../modelos/planta';

@Component({
  selector: 'app-plantas-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plantas-lista.component.html'
})
export class PlantasListaComponent {

  @Input() plantas: Planta[] = [];
  @Output() plantaSeleccionada = new EventEmitter<Planta>();

  seleccionar(planta: Planta): void {
    this.plantaSeleccionada.emit(planta);
  }
}

