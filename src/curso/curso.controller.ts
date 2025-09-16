import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CursoService } from "./curso.service";
import { AddDisciplinaDto, CreateCursoDto, UpdateCursoDto } from "./dto";

@Controller("cursos")
export class CursoController {
  constructor(private service: CursoService) {}

  @Post() create(@Body() dto: CreateCursoDto) { return this.service.create(dto); }
  @Get() findAll() { return this.service.findAll(); }
  @Get(":id") findOne(@Param("id") id: string) { return this.service.findOne(+id); }
  @Patch(":id") update(@Param("id") id: string, @Body() dto: UpdateCursoDto) { return this.service.update(+id, dto); }
  @Delete(":id") remove(@Param("id") id: string) { return this.service.remove(+id); }

  @Post(":id/disciplinas") addDisciplina(@Param("id") id: string, @Body() dto: AddDisciplinaDto) {
    return this.service.addDisciplina(+id, dto.nome);
  }
  @Delete(":id/disciplinas/:disciplinaId") removeDisciplina(@Param("id") id: string, @Param("disciplinaId") disciplinaId: string) {
    return this.service.removeDisciplina(+id, +disciplinaId);
  }
}
