import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CursoModule } from './curso/curso.module';
import { DisciplinaModule } from './disciplina/disciplina.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CursoModule,
    DisciplinaModule,
  ],
})
export class AppModule {}
