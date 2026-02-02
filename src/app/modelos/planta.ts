// src/app/modelos/planta.ts
export interface Planta {
  id: number;
  nombre: string;
  imagen: string;
  descripcion: string;
  tipo: 'hortaliza' | 'fruta' | 'hierba' | 'flor' | 'arbol';
}