export class JWTPayload {
  sub: string;
  email: string;
  role: string;

  constructor(sub: string, email: string, role: string) {
    this.sub = sub;
    this.email = email;
    this.role = role;
  }
}
