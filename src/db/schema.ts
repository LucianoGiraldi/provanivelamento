import { pgTable, serial, varchar, integer, date, timestamp, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cursos = pgTable("curso", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  cargaHoraria: integer("carga_horaria").notNull(),
  dataInicio: date("data_inicio").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const disciplinas = pgTable("disciplina", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  cursoId: integer("curso_id").notNull().references(() => cursos.id, { onDelete: "cascade" }),
});

export const cursoRelations = relations(cursos, ({ many }) => ({
  disciplinas: many(disciplinas),
}));
