export class User {
  constructor(
    public uid: string,
    public username: string,
    public email: string,
    public fecha_registro: string = new Date().toISOString(),
    public fotoPerfil?: string,  // Nueva: ruta de la foto de perfil
    public baneado?: boolean,    // Nueva: indica si el usuario está baneado
    public motivoBaneo?: string  // Nueva: razón del baneo (opcional)
  ) {}
}