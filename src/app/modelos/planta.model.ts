export class Planta {
  constructor(
    public nombre: string,
    public descripcion: string,
    public tipo: 'hortaliza' | 'fruta' | 'hierba' | 'flor' | 'arbol',
    public imagen: string,
    public estacion: string, // ej: "primavera, verano"
    public tiempo_crecimiento: number, // días
    public riego: 'bajo' | 'moderado' | 'alto',
    public luz: 'sombra' | 'semi-sombra' | 'pleno-sol',
    public abono: string,
    public incompatibilidades: string[] = [], // IDs de plantas
    public amenazas: string[] = [], // IDs de amenazas
    public id?: string,
    public nombre_cientifico?: string
  ) {}
}