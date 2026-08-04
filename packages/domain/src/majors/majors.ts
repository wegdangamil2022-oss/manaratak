import { z } from 'zod';
import { MajorImportCompletenessState } from '../generated/dummy';

export const MajorImportPayloadSchema = z.object({
  canonicalMajorName: z.string(),
  facultyName: z.string().optional(),
  description: z.string().optional(),
  careerOutcomes: z.any().optional(),
}).passthrough();

export class MajorCompletenessClassifier {
  static classify(payload: any): { state: MajorImportCompletenessState, missingFields?: string[] } {
    const missing = [];
    if (!payload.canonicalMajorName) missing.push('canonicalMajorName');
    if (missing.length > 0) return { state: MajorImportCompletenessState.INCOMPLETE, missingFields: missing };

    const reviewFields = [];
    if (!payload.academicFieldOrDiscipline && !payload.collegeOrFaculty) reviewFields.push('academicFieldOrDiscipline');
    if (!payload.officialSourceUrl) reviewFields.push('officialSourceUrl');

    if (reviewFields.length > 0) {
      return { state: MajorImportCompletenessState.NEEDS_REVIEW, missingFields: reviewFields };
    }

    return { state: MajorImportCompletenessState.COMPLETE };
  }
}
export class MajorNamingService {
  static normalize(name: string): string { return name.trim(); }
}
export class MajorDeduplicationService {
  static generateKey(payload: any): string {
    const discipline = payload.academicFieldOrDiscipline || payload.collegeOrFaculty || 'unknown';
    const degree = payload.degreeLevel || 'unknown';
    const classification = payload.sourceClassificationSystem || 'unknown';
    return `${payload.canonicalMajorName}|${discipline}|${degree}|${classification}`.toLowerCase();
  }
}
