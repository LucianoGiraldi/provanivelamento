import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}
  async register(email: string, password: string) {
    const hash = await bcrypt.hash(password, 10);
    const user = await this.users.create(email, hash);
    const token = await this.jwt.signAsync({ sub: user.id, email: user.email });
    return { user: { id: user.id, email: user.email }, token };
  }
  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException("Credenciais inválidas");
    }
    const token = await this.jwt.signAsync({ sub: user.id, email: user.email });
    return { user: { id: user.id, email: user.email }, token };
  }
}
