import { PrismaClient } from '@prisma/client';

export class PrismaMajorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<any | null> {
    const record = await this.prisma.major.findUnique({ where: { id } });
    return record ? this.mapToDto(record) : null;
  }

  async findBySlug(slug: string): Promise<any | null> {
    const record = await this.prisma.major.findUnique({ where: { slug } });
    return record ? this.mapToDto(record) : null;
  }

  async findByDedupKey(key: string): Promise<any | null> {
    const record = await this.prisma.major.findUnique({ where: { canonicalDedupKey: key } });
    return record ? this.mapToDto(record) : null;
  }

  async create(data: any): Promise<any> {
    const {
      publicId, slug, canonicalName, canonicalDedupKey, displayName, status, 
      completenessStatus, facultyName, optionalFields,
      ...rest
    } = data;
    
    const safeOptionalFields = {
      ...(optionalFields || {}),
      ...rest
    };

    const record = await this.prisma.major.create({
      data: {
        publicId, slug, canonicalName, canonicalDedupKey, displayName, status, 
        completenessStatus, facultyName,
        optionalFields: safeOptionalFields
      }
    });
    return this.mapToDto(record);
  }

  async update(id: string, updates: any): Promise<any> {
    const {
      id: _id, createdAt, updatedAt, publicId, slug, canonicalName, canonicalDedupKey,
      displayName, status, completenessStatus, facultyName, optionalFields,
      ...rest
    } = updates;
    
    const existing = await this.prisma.major.findUnique({ where: { id }});
    const existingOptional = (existing?.optionalFields as any) || {};

    const safeOptionalFields = {
      ...existingOptional,
      ...(optionalFields || {}),
      ...rest
    };

    const record = await this.prisma.major.update({
      where: { id },
      data: {
        displayName: displayName !== undefined ? displayName : undefined,
        status: status !== undefined ? status : undefined,
        completenessStatus: completenessStatus !== undefined ? completenessStatus : undefined,
        facultyName: facultyName !== undefined ? facultyName : undefined,
        optionalFields: safeOptionalFields
      }
    });
    return this.mapToDto(record);
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await this.prisma.major.update({
      where: { id },
      data: { status }
    });
  }

  async list(filters: any): Promise<any> {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    
    const where: any = {};
    if (filters.status) where.status = filters.status;
    
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
      data: data.map((d: any) => this.mapToDto(d)),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  }

  async listPublished(filters: any): Promise<any> {
    return this.list({ ...filters, status: 'PUBLISHED' });
  }

  private mapToDto(record: any): any {
    const { optionalFields, ...rest } = record;
    return {
      ...rest,
      ...(typeof optionalFields === 'object' && optionalFields ? optionalFields : {})
    };
  }
}
