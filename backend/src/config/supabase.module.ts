import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'SUPABASE_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return createClient(
          configService.getOrThrow<string>('SUPABASE_URL'),
          configService.getOrThrow<string>('SUPABASE_ANON_KEY'),
        );
      },
    },
    SupabaseService,
  ],
  exports: [SupabaseService],
})
export class SupabaseModule {}