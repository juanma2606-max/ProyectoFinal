export class Cultivo {
  constructor(
    public nombre: string,
    public plantaId: string,
    public fecha_siembra: string,
    public estado: 'plantado' | 'creciendo' | 'maduro' | 'cosechado' | 'enfermo',
    public cantidad: number = 1,
    public notas: string = '',
    public amenazaId: string | null = null,
    public id?: string
  ) {}
}