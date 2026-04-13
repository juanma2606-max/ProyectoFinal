export class Huerto {
  constructor(
    public nombre: string,
    public descripcion: string,
    public ubicacion: string,
    public superficie: number, // m²
    public tipo_suelo: 'arcilloso' | 'arenoso' | 'limoso' | 'franco',
    public horas_sol: number, // horas de sol directo al día
    public tiene_riego: boolean,
    public fecha_creacion: string = new Date().toISOString(),
    public id?: string,
    public notas?: string
  ) {}
}