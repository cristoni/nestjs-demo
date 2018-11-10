import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
  providers: [
    {
      // Load the service as a provider
      provide: ConfigService,

      // Tells the service which file to load upon initialization
      useValue: new ConfigService(`${process.env.NODE_ENV || 'development'}.env`),
    },
  ],

  // Expose it to any other module it implement it
  exports: [ConfigService],
})
export class ConfigModule {}