// src/app/modelos/amenaza.ts
export interface Amenaza {
  id: string;
  nombre: string;
  imagen: string;  // Ruta relativa: "images/amenazas/pulgon.png"
  descripcion: string;
  tipo: 'plaga' | 'enfermedad';
  // Campos estructurados (opcionales)
  sintomas?: string[];
  tratamiento?: string;
  prevencion?: string;
}