// import { formatDomainInstructions } from './mail/utils/format_domain_instruction';
// import { generateDomainConfig } from './mail/utils/generate_config';
// import { verifyDomainDns } from './mail/utils/verify_domain_dns';

// const config = generateDomainConfig('worcable.space');
// const userInstructions = formatDomainInstructions(config);

// console.log(JSON.stringify(userInstructions, null, 2));

// void verifyDomainDns('worcable.space');

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT ?? 3000;
  global.BASE_URL = process.env.BASE_URL ?? `http://localhost:${port}`;

  const app = await NestFactory.create(AppModule);
  await app.listen(port);

  console.log(`Application is running on: ${BASE_URL}`);
}

void bootstrap();
