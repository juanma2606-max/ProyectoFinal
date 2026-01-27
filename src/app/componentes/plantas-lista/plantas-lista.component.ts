import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Planta } from '../../modelos/planta';

@Component({
  selector: 'app-plantas-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plantas-lista.component.html'
})
export class PlantasListaComponent {

  @Output() plantaSeleccionada = new EventEmitter<Planta>();

  plantas: Planta[] = [
    {
      id: 1,
      nombre: 'Tomate',
      imagen: 'assets/images/tomate.jpg',
      descripcion: 'Lorem ipsum dolor sit amet.'
    },
    {
      id: 2,
      nombre: 'Lechuga',
      imagen: 'assets/images/lechuga.jpg',
      descripcion: 'Lorem ipsum dolor sit amet.'
    }
  ];

  seleccionar(planta: Planta): void {
    this.plantaSeleccionada.emit(planta);
  }
}
