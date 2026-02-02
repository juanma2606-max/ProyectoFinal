import { Injectable } from '@angular/core';
import { Plaga } from '../modelos/plagas';

@Injectable({
  providedIn: 'root'
})
export class PlagasService {

  private _datosCompletos: Plaga[] = [
    {
      id: 1,
      nombre: 'Pulgón',
      imagen: '/images/plagas/pulgon.png',
      descripcion: 'Descripción:\n' +
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
      descripcion: 'Descripción:\n' +
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
      descripcion: 'Descripción:\n' +
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
      descripcion: 'Descripción:\n' +
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
      descripcion: 'Descripción:\n' +
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
      descripcion: 'Descripción:\n' +
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

  /**
   * Obtiene todas las plagas y enfermedades
   */
  getTodos(): Plaga[] {
    return [...this._datosCompletos]; // Retorna copia para evitar mutaciones
  }

  
  /**
   * Obtiene una plaga/enfermedad por su ID
   * @param id El ID de la plaga/enfermedad
   * @returns La plaga/enfermedad o undefined si no existe
   */
  getPorId(id: number): Plaga | undefined {
    return this._datosCompletos.find(p => p.id === id);
  }

  /**
   * Obtiene plagas/enfermedades filtradas por tipo
   * @param tipo 'plaga' o 'enfermedad'
   * @returns Array filtrado
   */
  getPorTipo(tipo: 'plaga' | 'enfermedad'): Plaga[] {
    return this._datosCompletos.filter(p => p.tipo === tipo);
  }
}