// src/app/modelos/plagas.ts
export interface Plaga {
  id: number;
  nombre: string;
  imagen: string;
  descripcion: string;
  tipo: 'plaga' | 'enfermedad';
}