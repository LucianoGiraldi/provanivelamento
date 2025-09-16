import { Injectable, NotFoundException } from "@nestjs/common";
import { db } from "../db";
import { disciplinas } from "../db/schema";
import { eq } from "drizzle-orm";

@Injectable()
export class DisciplinaService {
  create(data: { nome: string; cursoId: number }) {
    return db.insert(disciplinas).values(data).returning();
  }
  findAll() { return db.select().from(disciplinas); }
  async update(id: number, data: Partial<{ nome: string }>) {
    const [d] = await db.update(disciplinas).set(data).where(eq(disciplinas.id, id)).returning();
    if (!d) throw new NotFoundException();
    return d;
  }
  async remove(id: number) {
    const [d] = await db.delete(disciplinas).where(eq(disciplinas.id, id)).returning();
    if (!d) throw new NotFoundException();
    return { ok: true };
  }
}
