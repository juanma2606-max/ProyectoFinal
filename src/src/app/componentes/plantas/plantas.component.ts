import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlantasListaComponent } from '../plantas-lista/plantas-lista.component';
import { Planta } from '../../modelos/planta';

@Component({
  selector: 'app-plantas',
  standalone: true,
  imports: [CommonModule, PlantasListaComponent],
  templateUrl: './plantas.component.html'
})
export class PlantasComponent {

  tipoActivo: Planta['tipo'] | null = null;
  plantaActiva: Planta | null = null;

  plantas: Planta[] = [
    {
      id: 1,
      nombre: 'Tomate',
      imagen: '/images/plantas/tomate.png',
      descripcion:
        'Estación:\n' +
        'Primavera y verano.\n\n' +
        'Abono recomendado:\n' +
        'Abono rico en potasio y fósforo, aplicado cada 15 días.\n\n' +
        'Riego:\n' +
        'Frecuente y regular, evitando encharcamientos.\n\n' +
        'Tiempo de crecimiento:\n' +
        'Entre 90 y 120 días desde la siembra.\n\n' +
        'Incompatibilidades:\n' +
        '- Patata.\n' +
        '- Hinojo.\n\n' +
        'Plagas y enfermedades comunes:\n' +
        '- Pulgón.\n' +
        '- Araña roja.\n' +
        '- Mildiu.',
      tipo: 'hortaliza'
    },
    {
      id: 2,
      nombre: 'Lechuga',
      imagen: '/images/plantas/lechuga.png',
      descripcion:
        'Estación:\n' +
        'Primavera y otoño.\n\n' +
        'Abono recomendado:\n' +
        'Abono equilibrado con alto contenido en nitrógeno.\n\n' +
        'Riego:\n' +
        'Riego frecuente y ligero, manteniendo el suelo húmedo.\n\n' +
        'Tiempo de crecimiento:\n' +
        'Entre 30 y 60 días.\n\n' +
        'Incompatibilidades:\n' +
        '- Perejil.\n\n' +
        'Plagas y enfermedades comunes:\n' +
        '- Babosas.\n' +
        '- Pulgón.\n' +
        '- Mildiu.',
      tipo: 'hortaliza'
    },
    {
      id: 3,
      nombre: 'Albahaca',
      imagen: '/images/plantas/albahaca.png',
      descripcion:
        'Estación:\n' +
        'Primavera y verano.\n\n' +
        'Abono recomendado:\n' +
        'Abono orgánico suave, preferiblemente compost.\n\n' +
        'Riego:\n' +
        'Moderado, evitando que el suelo se seque completamente.\n\n' +
        'Tiempo de crecimiento:\n' +
        'Entre 30 y 45 días.\n\n' +
        'Incompatibilidades:\n' +
        '- Ruda.\n\n' +
        'Plagas y enfermedades comunes:\n' +
        '- Pulgón.\n' +
        '- Mosca blanca.\n' +
        '- Oídio.',
      tipo: 'hierba'
    },
    {
      id: 4,
      nombre: 'Manzano',
      imagen: '/images/plantas/manzano.jpeg',
      descripcion:
        'Estación:\n' +
        'Crecimiento durante primavera y verano, reposo en invierno.\n\n' +
        'Abono recomendado:\n' +
        'Abono orgánico o estiércol bien compostado una vez al año.\n\n' +
        'Riego:\n' +
        'Moderado, aumentando en épocas de calor.\n\n' +
        'Tiempo de crecimiento:\n' +
        'Producción de frutos a partir del tercer o cuarto año.\n\n' +
        'Incompatibilidades:\n' +
        '- Nogal.\n\n' +
        'Plagas y enfermedades comunes:\n' +
        '- Carpocapsa.\n' +
        '- Oídio.\n' +
        '- Fuego bacteriano.',
      tipo: 'arbol'
    }
  ];

  get plantasFiltradas(): Planta[] {
    if (!this.tipoActivo) {
      return this.plantas;
    }
    return this.plantas.filter(p => p.tipo === this.tipoActivo);
  }

  seleccionarTipo(tipo: Planta['tipo'] | null): void {
    this.tipoActivo = tipo;
    this.plantaActiva = null;
  }

  onPlantaSeleccionada(planta: Planta): void {
    this.plantaActiva = planta;
  }
}
