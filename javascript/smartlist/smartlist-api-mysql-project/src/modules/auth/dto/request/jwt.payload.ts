export class JWTPayload {
  sub: number;
  email: string;
  role: string;

  constructor(sub: number, email: string, role: string) {
    this.sub = sub;
    this.email = email;
    this.role = role;
  }
}
