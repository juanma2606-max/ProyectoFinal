export class User {
  constructor(
    public uid: string,
    public username: string,
    public email: string,
    public fecha_registro: string = new Date().toISOString(),
  ) {}
}