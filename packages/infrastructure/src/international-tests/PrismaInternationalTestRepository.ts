import { PrismaClient, Prisma } from '@prisma/client';
import { 
  IInternationalTestRepository,
  InternationalTestDto, 
  UpsertInternationalTestDto,
  InternationalTestFilters,
  PaginatedInternationalTestResult,
  InternationalTestVariantDto,
  UpsertInternationalTestVariantDto,
  InternationalTestSectionDto,
  UpsertInternationalTestSectionDto,
  InternationalTestScoreScaleDto,
  UpsertInternationalTestScoreScaleDto,
  InternationalTestFeeMetadataDto,
  UpsertInternationalTestFeeMetadataDto,
  InternationalTestOfficialLinkDto,
  UpsertInternationalTestOfficialLinkDto,
  InternationalTestAvailabilityDto,
  UpsertInternationalTestAvailabilityDto,
  InternationalTestPreparationMaterialDto,
  UpsertInternationalTestPreparationMaterialDto,
  InternationalTestEvidenceDto,
  InternationalTestStatus,
  InternationalTestDeliveryMode
} from '@manaratak/domain';

const defaultInclude = {
  variants: true,
  sections: { orderBy: { order: 'asc' as const } },
  scoreScale: true,
  fees: true,
  officialLinks: true,
  availability: true,
  preparationMaterials: true,
  evidence: true
};

export class PrismaInternationalTestRepository implements IInternationalTestRepository {
  constructor(private readonly prisma: PrismaClient) {}

  // --- Legacy & Core Methods ---

  async findById(id: string): Promise<InternationalTestDto | null> {
    const record = await this.prisma.internationalTest.findUnique({ 
      where: { id },
      include: defaultInclude
    });
    if (!record) return null;

    if (!record.variants && this.prisma.internationalTestVariant) {
      record.variants = await this.prisma.internationalTestVariant.findMany({ where: { testId: id } });
      record.sections = await this.prisma.internationalTestSection.findMany({ where: { testId: id } });
      const scoreScales = await this.prisma.internationalTestScoreScale.findMany({ where: { testId: id } });
      record.scoreScale = scoreScales[0] || null;
      record.fees = await this.prisma.internationalTestFeeMetadata.findMany({ where: { testId: id } });
      record.officialLinks = await this.prisma.internationalTestOfficialLink.findMany({ where: { testId: id } });
      const availabilities = await this.prisma.internationalTestAvailability.findMany({ where: { testId: id } });
      record.availability = availabilities[0] || null;
      record.preparationMaterials = await this.prisma.internationalTestPreparationMaterial.findMany({ where: { testId: id } });
      record.evidence = await this.prisma.internationalTestEvidence.findUnique({ where: { testId: id } });
    }

    return this.mapToDto(record);
  }

  async findBySlug(slug: string): Promise<InternationalTestDto | null> {
    const record = await this.prisma.internationalTest.findUnique({ 
      where: { slug },
      include: defaultInclude
    });
    if (!record) return null;

    if (!record.variants && typeof this.prisma.internationalTestVariant?.findMany === 'function') {
      record.variants = await this.prisma.internationalTestVariant.findMany({ where: { testId: record.id } });
      record.sections = typeof this.prisma.internationalTestSection?.findMany === 'function' ? await this.prisma.internationalTestSection.findMany({ where: { testId: record.id } }) : [];
      const scoreScales = typeof this.prisma.internationalTestScoreScale?.findMany === 'function' ? await this.prisma.internationalTestScoreScale.findMany({ where: { testId: record.id } }) : [];
      record.scoreScale = scoreScales[0] || null;
      record.fees = typeof this.prisma.internationalTestFeeMetadata?.findMany === 'function' ? await this.prisma.internationalTestFeeMetadata.findMany({ where: { testId: record.id } }) : [];
      record.officialLinks = typeof this.prisma.internationalTestOfficialLink?.findMany === 'function' ? await this.prisma.internationalTestOfficialLink.findMany({ where: { testId: record.id } }) : [];
      const availabilities = typeof this.prisma.internationalTestAvailability?.findMany === 'function' ? await this.prisma.internationalTestAvailability.findMany({ where: { testId: record.id } }) : [];
      record.availability = availabilities[0] || null;
      record.preparationMaterials = typeof this.prisma.internationalTestPreparationMaterial?.findMany === 'function' ? await this.prisma.internationalTestPreparationMaterial.findMany({ where: { testId: record.id } }) : [];
      record.evidence = typeof this.prisma.internationalTestEvidence?.findUnique === 'function' ? await this.prisma.internationalTestEvidence.findUnique({ where: { testId: record.id } }) : null;
    }

    return this.mapToDto(record);
  }

  async findByDedupKey(key: string): Promise<InternationalTestDto | null> {
    const record = await this.prisma.internationalTest.findUnique({ 
      where: { canonicalDedupKey: key },
      include: defaultInclude
    });
    return record ? this.mapToDto(record) : null;
  }

  async create(data: any): Promise<InternationalTestDto> {
    const {
      publicId, slug, canonicalName, canonicalDedupKey, displayName, status, 
      completenessStatus, testCategory, providerName, sourceImportRecordId, optionalFields,
      localizedNameAr, localizedNameEn, abbreviation, isPubliclyVisible, isSourceVerified,
      registrationRequirements, identificationRequirements, retakePolicy,
      cancellationReschedulingNotes, accessibilityNotes,
      ...rest
    } = data;
    
    const safeOptionalFields = {
      ...(optionalFields || {}),
      ...rest
    };

    const record = await this.prisma.internationalTest.create({
      data: {
        publicId, slug, canonicalName, canonicalDedupKey, displayName, status, 
        completenessStatus, testCategory, providerName, sourceImportRecordId,
        localizedNameAr, localizedNameEn, abbreviation, 
        isPubliclyVisible: isPubliclyVisible ?? false, 
        isSourceVerified: isSourceVerified ?? false,
        registrationRequirements, identificationRequirements, retakePolicy,
        cancellationReschedulingNotes, accessibilityNotes,
        optionalFields: safeOptionalFields
      },
      include: defaultInclude
    });
    return this.mapToDto(record);
  }

  async update(id: string, updates: any): Promise<InternationalTestDto> {
    const {
      id: _id, createdAt, updatedAt, publicId, slug, canonicalName, canonicalDedupKey,
      displayName, status, completenessStatus, testCategory, providerName, 
      sourceImportRecordId, optionalFields,
      localizedNameAr, localizedNameEn, abbreviation, isPubliclyVisible, isSourceVerified,
      registrationRequirements, identificationRequirements, retakePolicy,
      cancellationReschedulingNotes, accessibilityNotes,
      ...rest
    } = updates;
    
    const existing = await this.prisma.internationalTest.findUnique({ where: { id }});
    const existingOptional = (existing?.optionalFields as any) || {};

    const safeOptionalFields = {
      ...existingOptional,
      ...(optionalFields || {}),
      ...rest
    };

    const record = await this.prisma.internationalTest.update({
      where: { id },
      data: {
        displayName: displayName !== undefined ? displayName : undefined,
        status: status !== undefined ? status : undefined,
        completenessStatus: completenessStatus !== undefined ? completenessStatus : undefined,
        testCategory: testCategory !== undefined ? testCategory : undefined,
        providerName: providerName !== undefined ? providerName : undefined,
        sourceImportRecordId: sourceImportRecordId !== undefined ? sourceImportRecordId : undefined,
        localizedNameAr: localizedNameAr !== undefined ? localizedNameAr : undefined,
        localizedNameEn: localizedNameEn !== undefined ? localizedNameEn : undefined,
        abbreviation: abbreviation !== undefined ? abbreviation : undefined,
        isPubliclyVisible: isPubliclyVisible !== undefined ? isPubliclyVisible : undefined,
        isSourceVerified: isSourceVerified !== undefined ? isSourceVerified : undefined,
        registrationRequirements: registrationRequirements !== undefined ? registrationRequirements : undefined,
        identificationRequirements: identificationRequirements !== undefined ? identificationRequirements : undefined,
        retakePolicy: retakePolicy !== undefined ? retakePolicy : undefined,
        cancellationReschedulingNotes: cancellationReschedulingNotes !== undefined ? cancellationReschedulingNotes : undefined,
        accessibilityNotes: accessibilityNotes !== undefined ? accessibilityNotes : undefined,
        optionalFields: safeOptionalFields
      },
      include: defaultInclude
    });
    return this.mapToDto(record);
  }

  async updateStatus(id: string, status: InternationalTestStatus | string): Promise<InternationalTestDto> {
    const record = await this.prisma.internationalTest.update({
      where: { id },
      data: { status: status as any },
      include: defaultInclude
    });
    return this.mapToDto(record);
  }

  async list(filters: InternationalTestFilters): Promise<PaginatedInternationalTestResult<InternationalTestDto>> {
    const page = Number(filters?.page) || 1;
    const pageSize = Number(filters?.pageSize || filters?.limit) || 20;
    
    const where: any = {};
    if (filters?.status) {
      if (Array.isArray(filters.status)) {
        where.status = { in: filters.status };
      } else {
        where.status = filters.status;
      }
    }

    const categories = filters?.category || filters?.testCategory;
    if (categories) {
      if (Array.isArray(categories)) {
        where.testCategory = { in: categories };
      } else {
        where.testCategory = categories;
      }
    }

    if (filters?.providerName) {
      where.providerName = filters.providerName;
    }

    if (filters?.completenessStatus) {
      if (Array.isArray(filters.completenessStatus)) {
        where.completenessStatus = { in: filters.completenessStatus };
      } else {
        where.completenessStatus = filters.completenessStatus;
      }
    }

    if (filters?.isPubliclyVisible !== undefined) {
      where.isPubliclyVisible = filters.isPubliclyVisible;
    }

    const search = filters?.searchQuery || filters?.q;
    if (search && typeof search === 'string' && search.trim() !== '') {
      const query = search.trim();
      where.OR = [
        { canonicalName: { contains: query, mode: 'insensitive' } },
        { providerName: { contains: query, mode: 'insensitive' } },
        { displayName: { contains: query, mode: 'insensitive' } },
        { slug: { contains: query, mode: 'insensitive' } }
      ];
    }
    
    const [data, total] = await Promise.all([
      this.prisma.internationalTest.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: defaultInclude
      }),
      this.prisma.internationalTest.count({ where })
    ]);
    
    return {
      data: data.map((d: any) => this.mapToDto(d)),
      total,
      page,
      limit: pageSize
    };
  }

  async listPublished(filters?: Omit<InternationalTestFilters, 'status'>): Promise<PaginatedInternationalTestResult<InternationalTestDto>> {
    return this.list({ ...filters, status: [InternationalTestStatus.PUBLISHED] });
  }

  // --- Normalized Profile & Discovery Methods ---

  async listTests(filters: InternationalTestFilters): Promise<PaginatedInternationalTestResult<InternationalTestDto>> {
    return this.list(filters);
  }

  async getTest(id: string): Promise<InternationalTestDto | null> {
    return this.findById(id);
  }

  async getTestBySlug(slug: string): Promise<InternationalTestDto | null> {
    return this.findBySlug(slug);
  }

  async getTestByDeterministicKey(key: string): Promise<InternationalTestDto | null> {
    return this.findByDedupKey(key);
  }

  async upsertTest(data: UpsertInternationalTestDto | any): Promise<InternationalTestDto> {
    if (data.id) {
      const existing = await this.findById(data.id);
      if (existing) {
        return this.update(data.id, data);
      }
    }
    
    if (data.slug) {
      const existing = await this.findBySlug(data.slug);
      if (existing) {
        return this.update(existing.id, data);
      }
    }

    const dedupKey = data.canonicalDedupKey || data.deterministicKey;
    if (dedupKey) {
      const existing = await this.findByDedupKey(dedupKey);
      if (existing) {
        return this.update(existing.id, data);
      }
    }

    return this.create(data);
  }

  // --- Normalized Child Domain Methods ---

  async listVariants(testId: string): Promise<InternationalTestVariantDto[]> {
    const records = await this.prisma.internationalTestVariant.findMany({ where: { testId } });
    return records.map((r: any) => this.mapVariantToDto(r));
  }

  async upsertVariant(testId: string, data: UpsertInternationalTestVariantDto & { id?: string }): Promise<InternationalTestVariantDto> {
    let record: any;
    if (data.id) {
      record = await this.prisma.internationalTestVariant.update({
        where: { id: data.id },
        data: {
          variantName: data.variantName,
          deliveryMode: data.deliveryMode,
          isActive: data.isActive ?? true,
          specificOfficialUrl: data.specificOfficialUrl,
          administrativeNotes: data.administrativeNotes
        }
      });
    } else {
      record = await this.prisma.internationalTestVariant.create({
        data: {
          testId,
          variantName: data.variantName,
          deliveryMode: data.deliveryMode,
          isActive: data.isActive ?? true,
          specificOfficialUrl: data.specificOfficialUrl,
          administrativeNotes: data.administrativeNotes
        }
      });
    }
    return this.mapVariantToDto(record);
  }

  async listSections(testId: string): Promise<InternationalTestSectionDto[]> {
    const records = await this.prisma.internationalTestSection.findMany({ 
      where: { testId },
      orderBy: { order: 'asc' }
    });
    return records.map((r: any) => this.mapSectionToDto(r));
  }

  async upsertSection(testId: string, data: UpsertInternationalTestSectionDto & { id?: string }): Promise<InternationalTestSectionDto> {
    let record: any;
    const questionTypesJson = data.questionTypes ? (data.questionTypes as any) : ((Prisma as any).JsonNull ?? null);
    if (data.id) {
      record = await this.prisma.internationalTestSection.update({
        where: { id: data.id },
        data: {
          sectionName: data.sectionName,
          sectionType: data.sectionType,
          durationMinutes: data.durationMinutes,
          order: data.order,
          questionTypes: questionTypesJson,
          scoreMinimum: data.scoreMinimum,
          scoreMaximum: data.scoreMaximum
        }
      });
    } else {
      record = await this.prisma.internationalTestSection.create({
        data: {
          testId,
          sectionName: data.sectionName,
          sectionType: data.sectionType,
          durationMinutes: data.durationMinutes,
          order: data.order,
          questionTypes: questionTypesJson,
          scoreMinimum: data.scoreMinimum,
          scoreMaximum: data.scoreMaximum
        }
      });
    }
    return this.mapSectionToDto(record);
  }

  async upsertScoreScale(testId: string, data: UpsertInternationalTestScoreScaleDto): Promise<InternationalTestScoreScaleDto> {
    const bandsOrLevelsJson = data.bandsOrLevels ? (data.bandsOrLevels as any) : ((Prisma as any).JsonNull ?? null);
    const payload = {
      overallMinimum: data.overallMinimum,
      overallMaximum: data.overallMaximum,
      scoreIncrement: data.scoreIncrement,
      bandsOrLevels: bandsOrLevelsJson,
      passFailRules: data.passFailRules,
      cefrEquivalency: data.cefrEquivalency,
      crossTestEquivalency: data.crossTestEquivalency,
      resultValidityDurationMonths: data.resultValidityDurationMonths,
      resultDeliveryTimeDays: data.resultDeliveryTimeDays,
      scoreReportingUrl: data.scoreReportingUrl
    };

    const record = await this.prisma.internationalTestScoreScale.upsert({
      where: { testId },
      create: { testId, ...payload },
      update: payload
    });
    return this.mapScoreScaleToDto(record);
  }

  async upsertFeeMetadata(testId: string, data: UpsertInternationalTestFeeMetadataDto & { id?: string }): Promise<InternationalTestFeeMetadataDto> {
    let record: any;
    if (data.id) {
      record = await this.prisma.internationalTestFeeMetadata.update({
        where: { id: data.id },
        data: {
          feeType: data.feeType,
          amount: data.amount,
          currencyCode: data.currencyCode,
          hasRegionalVariation: data.hasRegionalVariation ?? false,
          validityWindowNotes: data.validityWindowNotes
        }
      });
    } else {
      record = await this.prisma.internationalTestFeeMetadata.create({
        data: {
          testId,
          feeType: data.feeType,
          amount: data.amount,
          currencyCode: data.currencyCode,
          hasRegionalVariation: data.hasRegionalVariation ?? false,
          validityWindowNotes: data.validityWindowNotes
        }
      });
    }
    return this.mapFeeMetadataToDto(record);
  }

  async upsertOfficialLink(testId: string, data: UpsertInternationalTestOfficialLinkDto & { id?: string }): Promise<InternationalTestOfficialLinkDto> {
    let record: any;
    if (data.id) {
      record = await this.prisma.internationalTestOfficialLink.update({
        where: { id: data.id },
        data: {
          linkType: data.linkType,
          url: data.url,
          description: data.description
        }
      });
    } else {
      record = await this.prisma.internationalTestOfficialLink.create({
        data: {
          testId,
          linkType: data.linkType,
          url: data.url,
          description: data.description
        }
      });
    }
    return this.mapOfficialLinkToDto(record);
  }

  async listAvailability(testId: string): Promise<InternationalTestAvailabilityDto | null> {
    const record = await this.prisma.internationalTestAvailability.findUnique({ where: { testId } });
    return record ? this.mapAvailabilityToDto(record) : null;
  }

  async upsertAvailability(testId: string, data: UpsertInternationalTestAvailabilityDto): Promise<InternationalTestAvailabilityDto> {
    const countryIdsJson = (data.availableCountryIds || []) as any;
    const cityIdsJson = data.availableCityIds ? (data.availableCityIds as any) : ((Prisma as any).JsonNull ?? null);
    const regionsJson = data.onlineAvailabilityRegions ? (data.onlineAvailabilityRegions as any) : ((Prisma as any).JsonNull ?? null);

    const payload = {
      availableCountryIds: countryIdsJson,
      availableCityIds: cityIdsJson,
      onlineAvailabilityRegions: regionsJson,
      testingWindowsNotes: data.testingWindowsNotes
    };

    const record = await this.prisma.internationalTestAvailability.upsert({
      where: { testId },
      create: { testId, ...payload },
      update: payload
    });
    return this.mapAvailabilityToDto(record);
  }

  async listPreparationMaterials(testId: string): Promise<InternationalTestPreparationMaterialDto[]> {
    const records = await this.prisma.internationalTestPreparationMaterial.findMany({ where: { testId } });
    return records.map((r: any) => this.mapPreparationMaterialToDto(r));
  }

  async upsertPreparationMaterial(testId: string, data: UpsertInternationalTestPreparationMaterialDto & { id?: string }): Promise<InternationalTestPreparationMaterialDto> {
    let record: any;
    if (data.id) {
      record = await this.prisma.internationalTestPreparationMaterial.update({
        where: { id: data.id },
        data: {
          materialType: data.materialType,
          url: data.url,
          assetId: data.assetId,
          title: data.title,
          description: data.description
        }
      });
    } else {
      record = await this.prisma.internationalTestPreparationMaterial.create({
        data: {
          testId,
          materialType: data.materialType,
          url: data.url,
          assetId: data.assetId,
          title: data.title,
          description: data.description
        }
      });
    }
    return this.mapPreparationMaterialToDto(record);
  }

  async listEvidence(testId: string): Promise<InternationalTestEvidenceDto[]> {
    const record = await this.prisma.internationalTestEvidence.findUnique({ where: { testId } });
    return record ? [this.mapEvidenceToDto(record)] : [];
  }

  async addEvidence(testId: string, data: InternationalTestEvidenceDto): Promise<InternationalTestEvidenceDto> {
    const conflictingFieldsJson = data.conflictingFields ? (data.conflictingFields as any) : ((Prisma as any).JsonNull ?? null);
    const mergeSuggestionsJson = data.mergeSuggestions ? (data.mergeSuggestions as any) : ((Prisma as any).JsonNull ?? null);

    const payload = {
      originalImportedName: data.originalImportedName,
      normalizedCanonicalName: data.normalizedCanonicalName,
      deterministicKey: data.deterministicKey,
      sourceId: data.sourceId,
      sourceUrl: data.sourceUrl,
      contentHash: data.contentHash,
      retrievedAt: data.retrievedAt,
      evidenceSnippet: data.evidenceSnippet,
      duplicateStatus: data.duplicateStatus,
      conflictingFields: conflictingFieldsJson,
      mergeSuggestions: mergeSuggestionsJson,
      sourceTrustLevel: data.sourceTrustLevel
    };

    const record = await this.prisma.internationalTestEvidence.upsert({
      where: { testId },
      create: { testId, ...payload },
      update: payload
    });
    return this.mapEvidenceToDto(record);
  }

  // --- Private Mapping Helpers ---

  private mapToDto(record: any): InternationalTestDto {
    if (!record) return null as any;
    const { 
      optionalFields, 
      variants, 
      sections, 
      scoreScale, 
      fees, 
      officialLinks, 
      availability, 
      preparationMaterials, 
      evidence,
      ...rest 
    } = record;

    const base: InternationalTestDto = {
      ...rest,
      isPubliclyVisible: rest.isPubliclyVisible ?? false,
      isSourceVerified: rest.isSourceVerified ?? false,
      ...(typeof optionalFields === 'object' && optionalFields ? optionalFields : {})
    };

    if (variants && Array.isArray(variants)) {
      base.variants = variants.map(v => this.mapVariantToDto(v));
    }
    if (sections && Array.isArray(sections)) {
      base.sections = sections.map(s => this.mapSectionToDto(s));
    }
    if (scoreScale) {
      base.scoreScale = this.mapScoreScaleToDto(scoreScale);
    }
    if (fees && Array.isArray(fees)) {
      base.fees = fees.map(f => this.mapFeeMetadataToDto(f));
    }
    if (officialLinks && Array.isArray(officialLinks)) {
      base.officialLinks = officialLinks.map(l => this.mapOfficialLinkToDto(l));
    }
    if (availability) {
      base.availability = this.mapAvailabilityToDto(availability);
    }
    if (preparationMaterials && Array.isArray(preparationMaterials)) {
      base.preparationMaterials = preparationMaterials.map(m => this.mapPreparationMaterialToDto(m));
    }
    if (evidence) {
      base.importEvidence = this.mapEvidenceToDto(evidence);
    }

    return base;
  }

  private mapVariantToDto(v: any): InternationalTestVariantDto {
    return {
      id: v.id,
      variantName: v.variantName,
      deliveryMode: v.deliveryMode as InternationalTestDeliveryMode,
      isActive: v.isActive ?? true,
      specificOfficialUrl: v.specificOfficialUrl || undefined,
      administrativeNotes: v.administrativeNotes || undefined
    };
  }

  private mapSectionToDto(s: any): InternationalTestSectionDto {
    return {
      id: s.id,
      sectionName: s.sectionName,
      sectionType: s.sectionType,
      durationMinutes: s.durationMinutes ?? undefined,
      order: s.order,
      questionTypes: Array.isArray(s.questionTypes) ? s.questionTypes : undefined,
      scoreMinimum: s.scoreMinimum ?? undefined,
      scoreMaximum: s.scoreMaximum ?? undefined
    };
  }

  private mapScoreScaleToDto(sc: any): InternationalTestScoreScaleDto {
    return {
      id: sc.id,
      overallMinimum: sc.overallMinimum,
      overallMaximum: sc.overallMaximum,
      scoreIncrement: sc.scoreIncrement ?? undefined,
      bandsOrLevels: Array.isArray(sc.bandsOrLevels) ? sc.bandsOrLevels : undefined,
      passFailRules: sc.passFailRules || undefined,
      cefrEquivalency: sc.cefrEquivalency || undefined,
      crossTestEquivalency: sc.crossTestEquivalency || undefined,
      resultValidityDurationMonths: sc.resultValidityDurationMonths ?? undefined,
      resultDeliveryTimeDays: sc.resultDeliveryTimeDays ?? undefined,
      scoreReportingUrl: sc.scoreReportingUrl || undefined
    };
  }

  private mapFeeMetadataToDto(f: any): InternationalTestFeeMetadataDto {
    return {
      id: f.id,
      feeType: f.feeType,
      amount: f.amount,
      currencyCode: f.currencyCode,
      hasRegionalVariation: f.hasRegionalVariation ?? false,
      validityWindowNotes: f.validityWindowNotes || undefined
    };
  }

  private mapOfficialLinkToDto(l: any): InternationalTestOfficialLinkDto {
    return {
      id: l.id,
      linkType: l.linkType,
      url: l.url,
      description: l.description || undefined
    };
  }

  private mapAvailabilityToDto(a: any): InternationalTestAvailabilityDto {
    return {
      id: a.id,
      availableCountryIds: Array.isArray(a.availableCountryIds) ? a.availableCountryIds : [],
      availableCityIds: Array.isArray(a.availableCityIds) ? a.availableCityIds : undefined,
      onlineAvailabilityRegions: Array.isArray(a.onlineAvailabilityRegions) ? a.onlineAvailabilityRegions : undefined,
      testingWindowsNotes: a.testingWindowsNotes || undefined
    };
  }

  private mapPreparationMaterialToDto(m: any): InternationalTestPreparationMaterialDto {
    return {
      id: m.id,
      materialType: m.materialType,
      url: m.url || undefined,
      assetId: m.assetId || undefined,
      title: m.title,
      description: m.description || undefined
    };
  }

  private mapEvidenceToDto(e: any): InternationalTestEvidenceDto {
    return {
      originalImportedName: e.originalImportedName || undefined,
      normalizedCanonicalName: e.normalizedCanonicalName || undefined,
      deterministicKey: e.deterministicKey || undefined,
      sourceId: e.sourceId || undefined,
      sourceUrl: e.sourceUrl || undefined,
      contentHash: e.contentHash || undefined,
      retrievedAt: e.retrievedAt ? new Date(e.retrievedAt) : undefined,
      evidenceSnippet: e.evidenceSnippet || undefined,
      duplicateStatus: e.duplicateStatus || undefined,
      conflictingFields: Array.isArray(e.conflictingFields) ? e.conflictingFields : undefined,
      mergeSuggestions: e.mergeSuggestions || undefined,
      sourceTrustLevel: e.sourceTrustLevel || undefined
    };
  }
}
