import { BadRequestException } from '@nestjs/common';
import { parseExperienceInput } from './experience.dto';

describe('parseExperienceInput', () => {
  const validInput = {
    company: '  Empresa  ',
    position: '  Analista  ',
    startDate: '2024-01-15',
    endDate: '',
    currentlyWorking: true,
    employmentType: 'Tiempo completo',
    description: '  Desarrollo de sistemas  ',
  };

  it('normalizes text and permits an ongoing experience without an end date', () => {
    expect(parseExperienceInput(validInput)).toEqual({
      company: 'Empresa',
      position: 'Analista',
      startDate: '2024-01-15',
      endDate: '',
      currentlyWorking: true,
      employmentType: 'Tiempo completo',
      description: 'Desarrollo de sistemas',
    });
  });

  it('rejects impossible calendar dates', () => {
    expect(() =>
      parseExperienceInput({ ...validInput, startDate: '2024-02-30' }),
    ).toThrow(BadRequestException);
  });

  it('rejects an end date before the start date', () => {
    expect(() =>
      parseExperienceInput({
        ...validInput,
        currentlyWorking: false,
        endDate: '2023-12-31',
      }),
    ).toThrow(BadRequestException);
  });

  it('rejects non-object request bodies', () => {
    expect(() => parseExperienceInput(null)).toThrow(BadRequestException);
  });
});
