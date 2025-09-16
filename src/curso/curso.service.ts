import { Injectable, NotFoundException } from "@nestjs/common";
import { db } from "../db";
import { cursos, disciplinas } from "../db/schema";
import { eq } from "drizzle-orm";

@Injectable()
export class CursoService {
  async create(data: { nome: string; cargaHoraria: number; dataInicio: string }) {
    const [c] = await db.insert(cursos).values({ nome: data.nome, cargaHoraria: data.cargaHoraria, dataInicio: data.dataInicio as any }).returning();
    return c;
  }
  findAll() { return db.select().from(cursos); }

  async findOne(id: number) {
    const [c] = await db.select().from(cursos).where(eq(cursos.id, id));
    if (!c) throw new NotFoundException("Curso não encontrado");
    const ds = await db.select().from(disciplinas).where(eq(disciplinas.cursoId, id));
    return { ...c, disciplinas: ds };
  }
  async update(id: number, data: any) {
    const [c] = await db.update(cursos).set(data).where(eq(cursos.id, id)).returning();
    if (!c) throw new NotFoundException();
    return c;
  }
  async remove(id: number) {
    const [c] = await db.delete(cursos).where(eq(cursos.id, id)).returning();
    if (!c) throw new NotFoundException();
    return { ok: true };
  }
  async addDisciplina(cursoId: number, nome: string) {
    const [c] = await db.select().from(cursos).where(eq(cursos.id, cursoId));
    if (!c) throw new NotFoundException("Curso não encontrado");
    const [d] = await db.insert(disciplinas).values({ nome, cursoId }).returning();
    return d;
  }
  async removeDisciplina(_cursoId: number, disciplinaId: number) {
    const [d] = await db.delete(disciplinas).where(eq(disciplinas.id, disciplinaId)).returning();
    if (!d) throw new NotFoundException("Disciplina não encontrada");
    return { ok: true };
  }
}
