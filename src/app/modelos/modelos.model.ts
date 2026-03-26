export interface Cultivo {
  id: string;              // id_cultivo (el 3er nivel)
  plantaId: string;        // FK a Planta
  estado: 'creciendo' | 'cosechado' | 'enfermo' | 'muerto';
  fechaSiembra: string;
  notas: string;
}