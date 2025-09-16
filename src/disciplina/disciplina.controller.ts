import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { DisciplinaService } from "./disciplina.service";
import { CreateDisciplinaDto, UpdateDisciplinaDto } from "./dto";

@Controller("disciplinas")
export class DisciplinaController {
  constructor(private service: DisciplinaService) {}

  @Post() create(@Body() dto: CreateDisciplinaDto) { return this.service.create(dto); }
  @Get() findAll() { return this.service.findAll(); }
  @Patch(":id") update(@Param("id") id: string, @Body() dto: UpdateDisciplinaDto) { return this.service.update(+id, dto); }
  @Delete(":id") remove(@Param("id") id: string) { return this.service.remove(+id); }
}
