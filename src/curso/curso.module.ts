import { Module } from "@nestjs/common";
import { CursoService } from "./curso.service";
import { CursoController } from "./curso.controller";
@Module({ providers: [CursoService], controllers: [CursoController] })
export class CursoModule {}
