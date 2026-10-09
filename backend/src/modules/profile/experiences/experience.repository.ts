import {
  InternalServerErrorException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { PostgrestError } from '@supabase/supabase-js';
import { SupabaseService } from '../../../config/supabase.service';
import type { ExperienceInput, WorkExperience, WorkExperienceRow } from './experience.types';

const EXPERIENCE_COLUMNS =
  'id, empresa, cargo, fecha_inicio, fecha_fin, tipo_empleo, descripcion';

@Injectable()
export class ExperienceRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll(egresadoId: string): Promise<WorkExperience[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('experiencia_laboral')
      .select(EXPERIENCE_COLUMNS)
      .eq('id_egresado', egresadoId)
      .order('fecha_inicio', { ascending: false })
      .order('fecha_creacion', { ascending: false });

    if (error) throwDatabaseError(error);
    return (data ?? []).map(mapExperience);
  }

  async findOne(id: string, egresadoId: string): Promise<WorkExperience> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('experiencia_laboral')
      .select(EXPERIENCE_COLUMNS)
      .eq('id', id)
      .eq('id_egresado', egresadoId)
      .maybeSingle();

    if (error) throwDatabaseError(error);
    if (!data) {
      throw new NotFoundException('No se encontró la experiencia laboral solicitada.');
    }
    return mapExperience(data);
  }

  async create(input: ExperienceInput, egresadoId: string): Promise<WorkExperience> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('experiencia_laboral')
      .insert({
        id_egresado: egresadoId,
        empresa: input.company,
        cargo: input.position,
        fecha_inicio: input.startDate,
        fecha_fin: input.currentlyWorking ? null : input.endDate,
        tipo_empleo: input.employmentType,
        descripcion: input.description,
      })
      .select(EXPERIENCE_COLUMNS)
      .single();

    if (error) throwDatabaseError(error);
    return mapExperience(data);
  }

  async update(
    id: string,
    input: ExperienceInput,
    egresadoId: string,
  ): Promise<WorkExperience> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('experiencia_laboral')
      .update({
        empresa: input.company,
        cargo: input.position,
        fecha_inicio: input.startDate,
        fecha_fin: input.currentlyWorking ? null : input.endDate,
        tipo_empleo: input.employmentType,
        descripcion: input.description,
      })
      .eq('id', id)
      .eq('id_egresado', egresadoId)
      .select(EXPERIENCE_COLUMNS)
      .maybeSingle();

    if (error) throwDatabaseError(error);
    if (!data) {
      throw new NotFoundException('No se encontró la experiencia laboral solicitada.');
    }
    return mapExperience(data);
  }

  async remove(id: string, egresadoId: string): Promise<void> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('experiencia_laboral')
      .delete()
      .eq('id', id)
      .eq('id_egresado', egresadoId)
      .select('id')
      .maybeSingle();

    if (error) throwDatabaseError(error);
    if (!data) {
      throw new NotFoundException('No se encontró la experiencia laboral solicitada.');
    }
  }
}

function throwDatabaseError(error: PostgrestError): never {
  throw new InternalServerErrorException(
    `No se pudo acceder a experiencia_laboral en Supabase: ${error.message}`,
  );
}

function mapExperience(row: WorkExperienceRow): WorkExperience {
  return {
    id: row.id,
    company: row.empresa,
    position: row.cargo,
    startDate: row.fecha_inicio,
    endDate: row.fecha_fin ?? '',
    currentlyWorking: row.fecha_fin === null,
    employmentType: row.tipo_empleo,
    description: row.descripcion,
  };
}
