import {
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../../../config/supabase.service';
import type { ExperienceInput, WorkExperience } from './experience.types';
import { ExperienceRepository } from './experience.repository';

@Injectable()
export class ExperienceService {
  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseService: SupabaseService,
    private readonly repository: ExperienceRepository,
  ) {}

  async findAll(): Promise<WorkExperience[]> {
    return this.repository.findAll(await this.getProfileId());
  }

  async findOne(id: string): Promise<WorkExperience> {
    return this.repository.findOne(id, await this.getProfileId());
  }

  async create(input: ExperienceInput): Promise<WorkExperience> {
    return this.repository.create(input, await this.getProfileId());
  }

  async update(id: string, input: ExperienceInput): Promise<WorkExperience> {
    return this.repository.update(id, input, await this.getProfileId());
  }

  async remove(id: string): Promise<void> {
    await this.repository.remove(id, await this.getProfileId());
  }

  private async getProfileId(): Promise<string> {
    const id = this.configService.get<string>('PROFILE_EGRESADO_ID');
    if (!id || !isUuid(id)) {
      throw new ServiceUnavailableException(
        'Configura PROFILE_EGRESADO_ID con el UUID de un egresado existente para habilitar el perfil local.',
      );
    }

    const { data, error } = await this.supabaseService
      .getClient()
      .from('egresado')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new ServiceUnavailableException(
        `No se pudo validar PROFILE_EGRESADO_ID en Supabase: ${error.message}`,
      );
    }
    if (!data) {
      throw new ServiceUnavailableException(
        'PROFILE_EGRESADO_ID no corresponde a un egresado existente en Supabase.',
      );
    }

    return id;
  }
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}
