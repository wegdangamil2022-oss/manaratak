import {
  IMajorRepository,
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

  private mapToPublicDto(major: any): PublicMajorDto {
    const {
      id,
      canonicalDedupKey,
      sourceImportRecordId,
      status,
      completenessStatus,
      createdAt,
      optionalFields,
      ...publicData
    } = major;

    return {
      ...publicData,
      ...(optionalFields || {}),
    };
  }
}
