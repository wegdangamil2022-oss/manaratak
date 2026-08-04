import { z } from 'zod';
import { UniversityImportCompletenessState } from '../generated/dummy';

export const UniversityImportPayloadSchema = z.object({
  universityName: z.string(),
  country: z.string().optional(),
  institutionType: z.string().optional(),
  officialWebsite: z.string().optional(),
  sourceUrl: z.string().optional(),
  officialSourceUrl: z.string().optional(),
  city: z.string().optional(),
  logoAssetId: z.string().optional(),
  foundedYear: z.number().optional(),
  localizedNames: z.any().optional(),
  campuses: z.any().optional(),
  accreditations: z.any().optional(),
  rankings: z.any().optional(),
  description: z.string().optional(),
  languagesOfInstruction: z.any().optional(),
  tuitionReferences: z.any().optional(),
  admissionRequirements: z.any().optional(),
  academicPrograms: z.any().optional(),
  contactEmail: z.string().optional(),
  contactPhone: z.string().optional(),
  socialLinks: z.any().optional(),
  metadata: z.any().optional(),
}).passthrough();

export class UniversityCompletenessClassifier {
  static classify(payload: any): { state: UniversityImportCompletenessState, missingFields?: string[] } {
    const missing = [];
    if (!payload.universityName) missing.push('universityName');
    if (!payload.country) missing.push('country');
    if (!payload.institutionType) missing.push('institutionType');
    
    if (missing.length > 0) {
      return { state: UniversityImportCompletenessState.INCOMPLETE, missingFields: missing };
    }
    
    const reviewFields = [];
    if (!payload.officialWebsite) reviewFields.push('officialWebsite');
    if (!payload.city) reviewFields.push('city');
    if (!payload.officialSourceUrl) reviewFields.push('officialSourceUrl');
    
    if (reviewFields.length > 0) {
      return { state: UniversityImportCompletenessState.NEEDS_REVIEW, missingFields: reviewFields };
    }
    
    return { state: UniversityImportCompletenessState.COMPLETE };
  }
}
export class UniversityNamingService {
  static normalize(name: string): string {
    return name.trim();
  }
}
export class UniversityDeduplicationService {
  static generateKey(payload: any): string {
    let domain = 'unknown';
    if (payload.officialWebsite) {
      try {
        const url = new URL(payload.officialWebsite);
        domain = url.hostname.replace(/^www\./, '');
      } catch {
        domain = payload.officialWebsite;
      }
    }
    return `${payload.universityName}|${payload.country || 'UNKNOWN'}|${domain}`.toLowerCase();
  }
}
