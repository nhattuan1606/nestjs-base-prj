import { NestFactory } from '@nestjs/core';

import { Seeder } from './database/seeders/seeder';
import { SeederModule } from './database/seeders/seeder.module';

function bootstrap() {
  NestFactory.createApplicationContext(SeederModule)
    .then((appContext) => {
      const seeder = appContext.get(Seeder);
      seeder
        .seed()
        .then(() => {
          console.info('Seeding complete!');
        })
        .catch((error: unknown) => {
          console.error('Seeding failed!');

          throw error;
        })
        .finally(() => {
          (async () => {
            await appContext.close();
          })();
        });
    })
    .catch((error) => {
      throw error;
    });
}

bootstrap();
