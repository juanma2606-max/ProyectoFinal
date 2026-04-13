export class Amenaza {
  constructor(
    public nombre: string,
    public descripcion: string,
    public tipo: 'plaga' | 'enfermedad' | 'hongo',
    public imagen: string,
    public sintomas: string[] = [],
    public tratamiento: string = '',
    public id?: string
  ) {}
}