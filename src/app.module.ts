import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { CompaniesModule } from './companies/companies.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URL'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin); // 👉 áp dụng plugin global
          return connection;
        },
      })
    }),
    UsersModule,
    AuthModule,
    CompaniesModule
    // 👆 kết nối tới MongoDB (chạy bằng docker chẳng hạn)
  ],
  controllers: [AppController],
  providers: [AppService,
  ],
})
export class AppModule { }
