// src/app/modelos/planta.ts
export interface Planta {
  id: string;
  nombre: string;
  imagen: string;
  descripcion: string;  // Descripción general breve
  tipo: 'hortaliza' | 'fruta' | 'hierba' | 'flor' | 'arbol';
  // Campos estructurados para necesidades y amenazas
  estacion: string;
  abono: string;
  riego: string;
  tiempoCrecimiento: string;
  incompatibilidades: string[];  // Array de strings
  plagas: string[];              // Array de strings
}