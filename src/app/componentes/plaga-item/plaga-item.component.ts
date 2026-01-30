import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlagasListaComponent } from '../plagas-lista/plagas-lista.component';
import { Plaga } from '../../modelos/plagas';

@Component({
  selector: 'app-plagas',
  standalone: true,
  imports: [CommonModule, PlagasListaComponent],
  templateUrl: './plaga-item.component.html'
})
export class PlagasComponent {

  tipoActivo: 'plaga' | 'enfermedad' = 'plaga';
  plagaActiva: Plaga | null = null;

  plagas: Plaga[] = [
    {
      id: 1,
      nombre: 'Pulgón',
      imagen: '/images/plagas/pulgon.png',
      descripcion: 
        'Descripción:\n' +
        'El pulgón es un insecto pequeño que se alimenta de la savia de las plantas, debilitándolas y favoreciendo la aparición de otras enfermedades.\n\n' +
        'Síntomas:\n' +
        '- Hojas enrolladas o deformadas.\n' +
        '- Presencia de pequeños insectos verdes, negros o amarillos.\n' +
        '- Aparición de melaza pegajosa y hormigas.\n\n' +
        'Tratamiento:\n' +
        '- Lavado de la planta con agua y jabón potásico.\n' +
        '- Uso de aceite de neem.\n' +
        '- Introducción de insectos beneficiosos como mariquitas.',
      tipo: 'plaga'
    },
    {
      id: 2,
      nombre: 'Mildiu',
      imagen: '/images/enfermedades/mildiu.png',
      descripcion:
        'Descripción:\n' +
        'El mildiu es una enfermedad fúngica que aparece con alta humedad y temperaturas suaves, afectando principalmente a hojas y tallos.\n\n' +
        'Síntomas:\n' +
        '- Manchas amarillas en el haz de las hojas.\n' +
        '- Moho blanquecino o grisáceo en el envés.\n' +
        '- Caída prematura de hojas.\n\n' +
        'Tratamiento:\n' +
        '- Eliminar las partes afectadas.\n' +
        '- Aplicar fungicidas a base de cobre.\n' +
        '- Evitar el exceso de riego y mejorar la ventilación.',
      tipo: 'enfermedad'
    },
    {
      id: 3,
      nombre: 'Araña Roja',
      imagen: '/images/plagas/araña_roja.png',
      descripcion:
        'Descripción:\n' +
        'La araña roja es un ácaro diminuto que prolifera en ambientes secos y calurosos, causando daños progresivos en las hojas.\n\n' +
        'Síntomas:\n' +
        '- Punteado amarillo en las hojas.\n' +
        '- Aspecto seco y apagado de la planta.\n' +
        '- Presencia de finas telarañas.\n\n' +
        'Tratamiento:\n' +
        '- Aumentar la humedad ambiental.\n' +
        '- Aplicar acaricidas específicos.\n' +
        '- Pulverizar agua frecuentemente en el envés de las hojas.',
      tipo: 'plaga'
    },
    {
      id: 4,
      nombre: 'Cochinilla',
      imagen: '/images/plagas/cochinilla.png',
      descripcion:
        'Descripción:\n' +
        'La cochinilla es un insecto que se fija a tallos y hojas para alimentarse de la savia, debilitando la planta de forma progresiva.\n\n' +
        'Síntomas:\n' +
        '- Presencia de bultos blancos o marrones.\n' +
        '- Hojas amarillentas y caída prematura.\n' +
        '- Secreción de melaza.\n\n' +
        'Tratamiento:\n' +
        '- Retirada manual con algodón y alcohol.\n' +
        '- Aplicación de aceite mineral o aceite de neem.\n' +
        '- Podar zonas muy afectadas.',
      tipo: 'plaga'
    },
    {
      id: 5,
      nombre: 'Botritis',
      imagen: '/images/enfermedades/botritis.png',
      descripcion:
        'Descripción:\n' +
        'La botritis o moho gris es una enfermedad fúngica que afecta flores, frutos y tallos, especialmente en ambientes húmedos.\n\n' +
        'Síntomas:\n' +
        '- Aparición de moho grisáceo.\n' +
        '- Pudrición de frutos y flores.\n' +
        '- Manchas blandas y oscuras.\n\n' +
        'Tratamiento:\n' +
        '- Eliminar partes infectadas.\n' +
        '- Mejorar la ventilación.\n' +
        '- Aplicar fungicidas específicos.',
      tipo: 'enfermedad'
    },
    {
      id: 6,
      nombre: 'Oídio',
      imagen: '/images/enfermedades/oidio.png',
      descripcion:
        'Descripción:\n' +
        'El oídio es una enfermedad fúngica muy común que aparece como un polvo blanco sobre las hojas y tallos.\n\n' +
        'Síntomas:\n' +
        '- Polvo blanco en hojas y tallos.\n' +
        '- Hojas deformadas.\n' +
        '- Reducción del crecimiento.\n\n' +
        'Tratamiento:\n' +
        '- Aplicar azufre o fungicidas específicos.\n' +
        '- Reducir la humedad excesiva.\n' +
        '- Eliminar hojas afectadas.',
      tipo: 'enfermedad'
    }
  ];

  get plagasFiltradas(): Plaga[] {
    return this.plagas.filter(p => p.tipo === this.tipoActivo);
  }

  cambiarTipo(tipo: 'plaga' | 'enfermedad'): void {
    this.tipoActivo = tipo;
    this.plagaActiva = null;
  }

  onPlagaSeleccionada(plaga: Plaga): void {
    this.plagaActiva = plaga;
  }
}
