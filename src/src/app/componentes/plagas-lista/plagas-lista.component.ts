import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Plaga } from '../../modelos/plagas';


@Component({
  selector: 'app-plagas-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plagas-lista.component.html'
})
export class PlagasListaComponent {

  @Input() plagas: Plaga[] = [];
  @Output() plagaSeleccionada = new EventEmitter<Plaga>();

  seleccionar(plaga: Plaga): void {
    this.plagaSeleccionada.emit(plaga);
  }
}
