import {
  IMajorRepository,
  MajorDto,
  MajorStatus,
  PaginatedMajorResult,
  PublicMajorDto,
  PublicMajorFilters
} from '@manaratak/domain';

export class PublicMajorUseCases {
  constructor(private readonly repository: IMajorRepository) {}

  public async listMajors(filters: PublicMajorFilters): Promise<PaginatedMajorResult<PublicMajorDto>> {
    const paginated = await this.repository.listPublished(filters);

    return {
      ...paginated,
      data: paginated.data.map(this.mapToPublicDto)
    };
  }

  public async getMajor(slug: string): Promise<PublicMajorDto> {
    const major = await this.repository.findBySlug(slug);

    if (!major || major.status !== MajorStatus.PUBLISHED) {
      throw new Error('Major not found');
    }

    return this.mapToPublicDto(major);
  }

  private mapToPublicDto(major: MajorDto): PublicMajorDto {
    const {
      id: _id,
      canonicalDedupKey: _canonicalDedupKey,
      sourceImportRecordId: _sourceImportRecordId,
      status: _status,
      completenessStatus: _completenessStatus,
      createdAt: _createdAt,
      optionalFields,
      ...publicData
    } = major;

    return {
      ...publicData,
      ...(optionalFields || {}),
    };
  }
}
