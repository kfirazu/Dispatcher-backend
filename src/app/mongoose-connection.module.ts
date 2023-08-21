import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const MongooseConnectionModule = MongooseModule.forRootAsync({
    imports: [ConfigModule.forRoot({
        isGlobal: true
    })],
    useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_CONNECTION_STR'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        user: configService.get<string>('MONGO_DB_USERNAME'),
        pass: configService.get<string>('MONGO_DB_PASSWORD'),
        dbName: configService.get<string>('MONGO_DB_NAME'),
    }),
    inject: [ConfigService],
});