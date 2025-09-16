import { Injectable } from "@nestjs/common";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

@Injectable()
export class UsersService {
  async create(email: string, passwordHash: string) {
    const [u] = await db.insert(users).values({ email, passwordHash }).returning();
    return u;
  }
  async findByEmail(email: string) {
    const [u] = await db.select().from(users).where(eq(users.email, email));
    return u ?? null;
  }
}
