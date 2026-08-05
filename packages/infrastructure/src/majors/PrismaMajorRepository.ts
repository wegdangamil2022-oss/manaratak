import { Prisma, PrismaClient } from '@prisma/client';
import {
  IMajorRepository,
  MajorAliasDto,
  MajorClassificationMappingDto,
  MajorContentSectionDto,
  MajorDto,
  MajorFilters,
  MajorLevel,
  MajorLevelProfileDto,
  MajorLifecycleStatus,
  MajorRelationshipDto,
  MajorSourceDto,
  MajorStatus,
  MajorVersionDto,
  PaginatedMajorResult,
  PublicMajorFilters,
  UpdateMajorDto,
} from '@manaratak/domain';

export class PrismaMajorRepository implements IMajorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<MajorDto | null> {
    const record = await this.prisma.major.findUnique({ where: { id } });
    return record ? this.mapToDto(record) : null;
  }

  async findByPublicId(publicId: string): Promise<MajorDto | null> {
    const record = await this.prisma.major.findUnique({ where: { publicId } });
    return record ? this.mapToDto(record) : null;
  }

  async findBySlug(slug: string): Promise<MajorDto | null> {
    const record = await this.prisma.major.findUnique({ where: { slug } });
    return record ? this.mapToDto(record) : null;
  }

  async findByDedupKey(key: string): Promise<MajorDto | null> {
    const record = await this.prisma.major.findUnique({ where: { canonicalDedupKey: key } });
    return record ? this.mapToDto(record) : null;
  }

  async create(data: Omit<MajorDto, 'id' | 'createdAt' | 'updatedAt'> & Partial<Pick<MajorDto, 'id' | 'createdAt' | 'updatedAt'>>): Promise<MajorDto> {
    const {
      id: _id, createdAt: _createdAt, updatedAt: _updatedAt,
      publicId, slug, canonicalName, canonicalDedupKey, displayName, status,
      completenessStatus, facultyName, academicFieldId, disciplineId, currentPublishedVersionId,
      optionalFields, profiles: _profiles, versions: _versions, aliases: _aliases,
      relationships: _relationships, classificationMappings: _classificationMappings,
      sources: _sources,
      ...rest
    } = data;
    
    const safeOptionalFields = {
      ...this.asRecord(optionalFields),
      ...rest
    };

    const record = await this.prisma.major.create({
      data: {
        publicId, slug, canonicalName, canonicalDedupKey, displayName, status, 
        completenessStatus, facultyName,
        academicFieldId,
        disciplineId,
        currentPublishedVersionId,
        optionalFields: safeOptionalFields as Prisma.InputJsonObject
      }
    });
    return this.mapToDto(record);
  }

  async update(id: string, updates: UpdateMajorDto): Promise<MajorDto> {
    const {
      displayName, status, completenessStatus, academicFieldId, disciplineId,
      currentPublishedVersionId, optionalFields,
      ...rest
    } = updates;
    
    const existing = await this.prisma.major.findUnique({ where: { id }});
    const existingOptional = this.asRecord(existing?.optionalFields);

    const safeOptionalFields = {
      ...existingOptional,
      ...this.asRecord(optionalFields),
      ...rest
    };

    const record = await this.prisma.major.update({
      where: { id },
      data: {
        displayName: displayName !== undefined ? displayName : undefined,
        status: status !== undefined ? status : undefined,
        completenessStatus: completenessStatus !== undefined ? completenessStatus : undefined,
        academicFieldId: academicFieldId !== undefined ? academicFieldId : undefined,
        disciplineId: disciplineId !== undefined ? disciplineId : undefined,
        currentPublishedVersionId: currentPublishedVersionId !== undefined ? currentPublishedVersionId : undefined,
        optionalFields: safeOptionalFields as Prisma.InputJsonObject
      }
    });
    return this.mapToDto(record);
  }

  async updateStatus(id: string, status: MajorLifecycleStatus): Promise<void> {
    await this.prisma.major.update({
      where: { id },
      data: { status }
    });
  }

  async updateImportLink(id: string, sourceImportRecordId: string): Promise<void> {
    const existing = await this.prisma.major.findUnique({ where: { id }});
    const existingOptional = this.asRecord(existing?.optionalFields);

    await this.prisma.major.update({
      where: { id },
      data: {
        optionalFields: {
          ...existingOptional,
          sourceImportRecordId,
        } as Prisma.InputJsonObject,
      },
    });
  }

  async listByStatus(status: MajorLifecycleStatus): Promise<MajorDto[]> {
    const records = await this.prisma.major.findMany({
      where: { status },
      orderBy: { displayName: 'asc' },
    });

    return records.map((record) => this.mapToDto(record));
  }

  async list(filters: MajorFilters): Promise<PaginatedMajorResult<MajorDto>> {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    
    const where: Prisma.MajorWhereInput = {};
    if (filters.status) where.status = filters.status;
    if (filters.completenessStatus) where.completenessStatus = filters.completenessStatus;
    if (filters.academicFieldId) where.academicFieldId = filters.academicFieldId;
    if (filters.disciplineId) where.disciplineId = filters.disciplineId;
    if (filters.search) {
      where.OR = [
        { displayName: { contains: filters.search, mode: 'insensitive' } },
        { canonicalName: { contains: filters.search, mode: 'insensitive' } },
        { slug: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    
    const [data, total] = await Promise.all([
      this.prisma.major.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.major.count({ where })
    ]);
    
    return {
      data: data.map((record) => this.mapToDto(record)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  }

  async listPublished(filters: PublicMajorFilters): Promise<PaginatedMajorResult<MajorDto>> {
    return this.list({ ...filters, status: MajorStatus.PUBLISHED });
  }

  async createVersion(data: Omit<MajorVersionDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<MajorVersionDto> {
    const record = await this.prisma.majorVersion.create({
      data: {
        majorId: data.majorId ?? '',
        profileId: data.profileId,
        versionNumber: data.versionNumber,
        status: data.status,
        sourceImportRecordId: data.sourceImportRecordId,
        sourceFileName: data.sourceFileName,
        sourceUri: data.sourceUri,
        sourceHash: data.sourceHash,
        importedAt: data.importedAt,
        publishedAt: data.publishedAt,
        approvedBy: data.approvedBy,
        supersededAt: data.supersededAt,
        changeSummary: data.changeSummary as Prisma.InputJsonObject | undefined,
        rawContentBlocks: data.rawContentBlocks as Prisma.InputJsonObject | undefined,
        metadata: data.metadata as Prisma.InputJsonObject | undefined,
      },
    });

    return this.mapVersionToDto(record);
  }

  async listVersions(majorId: string): Promise<MajorVersionDto[]> {
    const records = await this.prisma.majorVersion.findMany({
      where: { majorId },
      orderBy: [{ versionNumber: 'desc' }, { createdAt: 'desc' }],
    });

    return records.map((record) => this.mapVersionToDto(record));
  }

  async createLevelProfile(data: Omit<MajorLevelProfileDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<MajorLevelProfileDto> {
    const record = await this.prisma.majorLevelProfile.create({
      data: {
        majorId: data.majorId ?? '',
        level: data.level,
        code: data.code,
        profileType: data.profileType,
        displayName: data.displayName,
        localizedNameAr: data.localizedNameAr,
        localizedNameEn: data.localizedNameEn,
        collegeContext: data.collegeContext,
        academicFieldId: data.academicFieldId,
        disciplineId: data.disciplineId,
        currentPublishedVersionId: data.currentPublishedVersionId,
        status: data.status,
        completenessStatus: data.completenessStatus,
        metadata: data.metadata as Prisma.InputJsonObject | undefined,
      },
    });

    return this.mapLevelProfileToDto(record);
  }

  async findLevelProfile(majorId: string, level: MajorLevel, code?: string): Promise<MajorLevelProfileDto | null> {
    const record = await this.prisma.majorLevelProfile.findFirst({
      where: {
        majorId,
        level,
        code: code ?? null,
      },
      orderBy: { createdAt: 'desc' },
    });

    return record ? this.mapLevelProfileToDto(record) : null;
  }

  async listLevelProfiles(majorId: string): Promise<MajorLevelProfileDto[]> {
    const records = await this.prisma.majorLevelProfile.findMany({
      where: { majorId },
      orderBy: [{ level: 'asc' }, { createdAt: 'desc' }],
    });

    return records.map((record) => this.mapLevelProfileToDto(record));
  }

  async createContentSections(data: Array<Omit<MajorContentSectionDto, 'id'>>): Promise<{ count: number }> {
    if (data.length === 0) {
      return { count: 0 };
    }

    const result = await this.prisma.majorContentSection.createMany({
      data: data.map((section) => ({
        profileId: section.profileId,
        versionId: section.versionId,
        sectionKey: section.sectionKey,
        title: section.title,
        locale: section.locale,
        content: section.content,
        sourceSectionPath: section.sourceSectionPath,
        reviewStatus: section.reviewStatus,
        metadata: section.metadata as Prisma.InputJsonObject | undefined,
      })),
      skipDuplicates: true,
    });

    return { count: result.count };
  }

  async listContentSections(majorId: string): Promise<MajorContentSectionDto[]> {
    const records = await this.prisma.majorContentSection.findMany({
      where: {
        OR: [
          { profile: { majorId } },
          { version: { majorId } },
        ],
      },
      orderBy: [{ profileId: 'asc' }, { sectionKey: 'asc' }, { createdAt: 'asc' }],
    });

    return records.map((record) => this.mapContentSectionToDto(record));
  }

  async createAliases(data: Array<Omit<MajorAliasDto, 'id'>>): Promise<{ count: number }> {
    if (data.length === 0) {
      return { count: 0 };
    }

    const result = await this.prisma.majorAlias.createMany({
      data: data.map((alias) => ({
        majorId: alias.majorId ?? '',
        locale: alias.locale,
        alias: alias.alias,
        normalizedAlias: alias.normalizedAlias ?? alias.alias.trim().toLowerCase(),
        aliasType: alias.aliasType ?? 'ALIAS',
        sourceId: alias.sourceId,
      })),
      skipDuplicates: true,
    });

    return { count: result.count };
  }

  async listAliases(majorId: string): Promise<MajorAliasDto[]> {
    const records = await this.prisma.majorAlias.findMany({
      where: { majorId },
      orderBy: [{ aliasType: 'asc' }, { locale: 'asc' }, { alias: 'asc' }],
    });

    return records.map((record) => ({
      ...record,
      locale: record.locale ?? undefined,
      aliasType: record.aliasType as MajorAliasDto['aliasType'],
      sourceId: record.sourceId ?? undefined,
    }));
  }

  async createRelationships(data: Array<Omit<MajorRelationshipDto, 'id'>>): Promise<{ count: number }> {
    if (data.length === 0) {
      return { count: 0 };
    }

    const result = await this.prisma.majorRelationship.createMany({
      data: data.map((relationship) => ({
        sourceMajorId: relationship.sourceMajorId,
        targetMajorId: relationship.targetMajorId,
        sourceProfileId: relationship.sourceProfileId,
        targetProfileId: relationship.targetProfileId,
        relationshipType: relationship.relationshipType,
        confidence: relationship.confidence,
        notes: relationship.notes,
        metadata: relationship.metadata as Prisma.InputJsonObject | undefined,
      })),
      skipDuplicates: true,
    });

    return { count: result.count };
  }

  async listRelationships(majorId: string): Promise<MajorRelationshipDto[]> {
    const records = await this.prisma.majorRelationship.findMany({
      where: {
        OR: [
          { sourceMajorId: majorId },
          { targetMajorId: majorId },
          { sourceProfile: { majorId } },
          { targetProfile: { majorId } },
        ],
      },
      orderBy: [{ relationshipType: 'asc' }, { createdAt: 'asc' }],
    });

    return records.map((record) => ({
      ...record,
      sourceMajorId: record.sourceMajorId ?? undefined,
      targetMajorId: record.targetMajorId ?? undefined,
      sourceProfileId: record.sourceProfileId ?? undefined,
      targetProfileId: record.targetProfileId ?? undefined,
      relationshipType: record.relationshipType as MajorRelationshipDto['relationshipType'],
      confidence: record.confidence ?? undefined,
      notes: record.notes ?? undefined,
      metadata: this.asRecord(record.metadata),
    }));
  }

  async createClassificationMappings(data: Array<Omit<MajorClassificationMappingDto, 'id'>>): Promise<{ count: number }> {
    if (data.length === 0) {
      return { count: 0 };
    }

    const result = await this.prisma.majorClassificationMapping.createMany({
      data: data.map((mapping) => ({
        majorId: mapping.majorId,
        profileId: mapping.profileId,
        taxonomyNodeId: mapping.taxonomyNodeId,
        relationshipType: mapping.relationshipType,
        standardType: mapping.standardType,
        standardCode: mapping.standardCode,
        confidence: mapping.confidence,
        notes: mapping.notes,
        metadata: mapping.metadata as Prisma.InputJsonObject | undefined,
      })),
      skipDuplicates: true,
    });

    return { count: result.count };
  }

  async listClassificationMappings(majorId: string): Promise<MajorClassificationMappingDto[]> {
    const records = await this.prisma.majorClassificationMapping.findMany({
      where: {
        OR: [
          { majorId },
          { profile: { majorId } },
        ],
      },
      orderBy: [{ relationshipType: 'asc' }, { createdAt: 'asc' }],
    });

    return records.map((record) => ({
      ...record,
      majorId: record.majorId ?? undefined,
      profileId: record.profileId ?? undefined,
      relationshipType: record.relationshipType as MajorClassificationMappingDto['relationshipType'],
      standardType: record.standardType ?? undefined,
      standardCode: record.standardCode ?? undefined,
      confidence: record.confidence ?? undefined,
      notes: record.notes ?? undefined,
      metadata: this.asRecord(record.metadata),
    }));
  }

  async createSource(data: Omit<MajorSourceDto, 'id' | 'createdAt' | 'updatedAt'>): Promise<MajorSourceDto> {
    const record = await this.prisma.majorSource.create({
      data: {
        majorId: data.majorId,
        profileId: data.profileId,
        sourceType: data.sourceType,
        sourceName: data.sourceName,
        sourceUri: data.sourceUri,
        sourceHash: data.sourceHash,
        importedAt: data.importedAt,
        metadata: data.metadata as Prisma.InputJsonObject | undefined,
      },
    });

    return this.mapSourceToDto(record);
  }

  async listSources(majorId: string): Promise<MajorSourceDto[]> {
    const records = await this.prisma.majorSource.findMany({
      where: { majorId },
      orderBy: [{ importedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return records.map((record) => this.mapSourceToDto(record));
  }

  private mapToDto(record: Prisma.MajorGetPayload<Record<string, never>>): MajorDto {
    const { optionalFields, ...rest } = record;
    return {
      ...rest,
      ...this.asRecord(optionalFields),
      optionalFields: this.asRecord(optionalFields),
    } as MajorDto;
  }

  private asRecord(value: Prisma.JsonValue | Record<string, unknown> | null | undefined): Record<string, unknown> {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }
    return {};
  }

  private mapVersionToDto(record: Prisma.MajorVersionGetPayload<Record<string, never>>): MajorVersionDto {
    return {
      ...record,
      profileId: record.profileId ?? undefined,
      sourceImportRecordId: record.sourceImportRecordId ?? undefined,
      sourceFileName: record.sourceFileName ?? undefined,
      sourceUri: record.sourceUri ?? undefined,
      sourceHash: record.sourceHash ?? undefined,
      importedAt: record.importedAt ?? undefined,
      publishedAt: record.publishedAt ?? undefined,
      approvedBy: record.approvedBy ?? undefined,
      supersededAt: record.supersededAt ?? undefined,
      status: record.status as MajorVersionDto['status'],
      changeSummary: this.asRecord(record.changeSummary),
      rawContentBlocks: this.asRecord(record.rawContentBlocks),
      metadata: this.asRecord(record.metadata),
    };
  }

  private mapLevelProfileToDto(record: Prisma.MajorLevelProfileGetPayload<Record<string, never>>): MajorLevelProfileDto {
    return {
      ...record,
      level: record.level as MajorLevelProfileDto['level'],
      code: record.code ?? undefined,
      profileType: record.profileType as MajorLevelProfileDto['profileType'],
      displayName: record.displayName ?? undefined,
      localizedNameAr: record.localizedNameAr ?? undefined,
      localizedNameEn: record.localizedNameEn ?? undefined,
      collegeContext: record.collegeContext ?? undefined,
      academicFieldId: record.academicFieldId ?? undefined,
      disciplineId: record.disciplineId ?? undefined,
      currentPublishedVersionId: record.currentPublishedVersionId ?? undefined,
      status: record.status as MajorLevelProfileDto['status'],
      completenessStatus: record.completenessStatus as MajorLevelProfileDto['completenessStatus'],
      metadata: this.asRecord(record.metadata),
    };
  }

  private mapContentSectionToDto(record: Prisma.MajorContentSectionGetPayload<Record<string, never>>): MajorContentSectionDto {
    return {
      ...record,
      profileId: record.profileId ?? undefined,
      versionId: record.versionId ?? undefined,
      title: record.title ?? undefined,
      locale: record.locale ?? undefined,
      sourceSectionPath: record.sourceSectionPath ?? undefined,
      reviewStatus: record.reviewStatus as MajorContentSectionDto['reviewStatus'],
      metadata: this.asRecord(record.metadata),
    };
  }

  private mapSourceToDto(record: Prisma.MajorSourceGetPayload<Record<string, never>>): MajorSourceDto {
    return {
      ...record,
      majorId: record.majorId ?? undefined,
      profileId: record.profileId ?? undefined,
      sourceUri: record.sourceUri ?? undefined,
      sourceHash: record.sourceHash ?? undefined,
      importedAt: record.importedAt ?? undefined,
      sourceType: record.sourceType as MajorSourceDto['sourceType'],
      metadata: this.asRecord(record.metadata),
    };
  }
}
