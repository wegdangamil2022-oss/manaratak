import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  IMajorRepository,
  MajorImportCompletenessState,
  MajorStatus
} from '@manaratak/domain';
import { AdminMajorUseCases } from '../../src/majors/use-cases/AdminMajorUseCases';

describe('AdminMajorUseCases', () => {
  let mockRepo: IMajorRepository;
  let useCases: AdminMajorUseCases;

  beforeEach(() => {
    mockRepo = {
      create: vi.fn(),
      update: vi.fn(),
      findByDedupKey: vi.fn(),
      findById: vi.fn(),
      findByPublicId: vi.fn(),
      findBySlug: vi.fn(),
      updateStatus: vi.fn(),
      updateImportLink: vi.fn(),
      listByStatus: vi.fn(),
      list: vi.fn(),
    };
    useCases = new AdminMajorUseCases(mockRepo);
  });

  it('listMajors delegates filters to repository', async () => {
    const filters = { status: MajorStatus.READY_TO_REVIEW, degreeLevel: 'Bachelor', page: 2 };
    mockRepo.list = vi.fn().mockResolvedValue({ data: [], total: 0, page: 2, pageSize: 20, totalPages: 0 });

    await useCases.listMajors(filters);

    expect(mockRepo.list).toHaveBeenCalledWith(filters);
  });

  it('updateMajor updates fields and recomputes completeness', async () => {
    mockRepo.findById = vi.fn().mockResolvedValue({
      id: 'major-1',
      displayName: 'Computer Science',
      degreeLevel: 'Bachelor',
      sourceClassificationSystem: 'CIP',
      academicFieldOrDiscipline: 'Computing',
      officialSourceUrl: 'https://nces.ed.gov/ipeds/cipcode',
      status: MajorStatus.IMPORTED,
      completenessStatus: MajorImportCompletenessState.COMPLETE
    });
    mockRepo.update = vi.fn().mockResolvedValue({ id: 'major-1' });

    await useCases.updateMajor('major-1', {
      displayName: 'Updated Computer Science'
    });

    console.log(mockRepo.update.mock.calls); expect(mockRepo.update).toHaveBeenCalledWith('major-1', expect.objectContaining({
      displayName: 'Updated Computer Science',
      completenessStatus: MajorImportCompletenessState.COMPLETE
    }));
  });

  it('markReadyToPublish only allows COMPLETE majors', async () => {
    mockRepo.findById = vi.fn().mockResolvedValue({
      id: 'major-1',
      status: MajorStatus.READY_TO_REVIEW,
      completenessStatus: MajorImportCompletenessState.COMPLETE
    });

    await useCases.markReadyToPublish('major-1');

    expect(mockRepo.updateStatus).toHaveBeenCalledWith('major-1', MajorStatus.READY_TO_PUBLISH);
  });

  it('publish only allows READY_TO_PUBLISH majors', async () => {
    mockRepo.findById = vi.fn().mockResolvedValue({
      id: 'major-1',
      status: MajorStatus.IMPORTED,
      completenessStatus: MajorImportCompletenessState.COMPLETE
    });

    await expect(useCases.publish('major-1')).rejects.toThrow('Only READY_TO_PUBLISH');
  });
});
