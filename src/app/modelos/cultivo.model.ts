export interface Cultivo {
  id: string;
  plantaId: string;
  estado: 'sana' | 'enferma' | 'infectada';
  fechaSiembra: string;
  notas: string;
  amenazaId?: string | null // ID de la enfermedad o plaga seleccionada
}