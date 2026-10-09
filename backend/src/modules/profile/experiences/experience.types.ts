export interface ExperienceInput {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  employmentType: string;
  description: string;
}

export interface WorkExperience extends ExperienceInput {
  id: string;
}

export interface WorkExperienceRow {
  id: string;
  empresa: string;
  cargo: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  tipo_empleo: string;
  descripcion: string;
}
