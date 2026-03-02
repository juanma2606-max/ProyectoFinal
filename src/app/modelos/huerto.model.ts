type Tipo = 'parcela'|'maceta';

export class Huerto {
    
  constructor(public id: string,public nombre: string,public descripcion: string,public fecha_creacion: Date, public tipo: Tipo) {}
}