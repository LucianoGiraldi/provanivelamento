import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { CursoModule } from "./curso/curso.module";
import { DisciplinaModule } from "./disciplina/disciplina.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, UsersModule, CursoModule, DisciplinaModule],
})
export class AppModule {}
