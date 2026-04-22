import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Incident } from './incident.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST') || 'localhost',
        port: configService.get<number>('POSTGRES_PORT') || 5432,
        username: configService.get<string>('POSTGRES_USER') || 'postgres',
        password: configService.get<string>('POSTGRES_PASSWORD') || 'secret',
        database: 'incident_db',
        entities: [Incident],
        synchronize: true, // Auto-syncs schema for development
      }),
    }),
    TypeOrmModule.forFeature([Incident]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
