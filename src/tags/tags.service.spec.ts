import { Test, TestingModule } from '@nestjs/testing';
import { TagsService } from './tags.service';
import { PrismaService } from '../database/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('TagsService', () => {
  let service: TagsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    tag: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    collectionTag: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
      findMany: jest.fn(),
    },
    questionTag: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new tag', async () => {
      const createTagDto = { name: 'Test Tag' };
      const expectedTag = { id: '1', ...createTagDto, created_at: new Date(), updated_at: new Date() };

      mockPrismaService.tag.create.mockResolvedValue(expectedTag);

      const result = await service.create(createTagDto);

      expect(mockPrismaService.tag.create).toHaveBeenCalledWith({
        data: createTagDto,
      });
      expect(result).toEqual(expectedTag);
    });

    it('should throw ConflictException when tag name already exists', async () => {
      const createTagDto = { name: 'Existing Tag' };
      const error = { code: 'P2002' };

      mockPrismaService.tag.create.mockRejectedValue(error);

      await expect(service.create(createTagDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all tags with counts', async () => {
      const expectedTags = [        {
          id: '1',
          name: 'Tag 1',
          created_at: new Date(),
          updated_at: new Date(),
          _count: { collections: 2, questions: 3 },
        },
      ];

      mockPrismaService.tag.findMany.mockResolvedValue(expectedTags);

      const result = await service.findAll();

      expect(mockPrismaService.tag.findMany).toHaveBeenCalledWith({
        include: {
          _count: {
            select: {
              collections: true,
              questions: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
      expect(result).toEqual(expectedTags);
    });
  });

  describe('findOne', () => {
    it('should return a tag by id', async () => {
      const tagId = '1';      const expectedTag = {
        id: tagId,
        name: 'Test Tag',
        created_at: new Date(),
        updated_at: new Date(),
        _count: { collections: 1, questions: 2 },
      };

      mockPrismaService.tag.findUnique.mockResolvedValue(expectedTag);

      const result = await service.findOne(tagId);

      expect(mockPrismaService.tag.findUnique).toHaveBeenCalledWith({
        where: { id: tagId },
        include: {
          _count: {
            select: {
              collections: true,
              questions: true,
            },
          },
        },
      });
      expect(result).toEqual(expectedTag);
    });

    it('should throw NotFoundException when tag does not exist', async () => {
      const tagId = 'non-existent';

      mockPrismaService.tag.findUnique.mockResolvedValue(null);

      await expect(service.findOne(tagId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('assignTagsToCollection', () => {
    it('should assign tags to collection', async () => {
      const collectionId = 'collection-1';
      const tagIds = ['tag-1', 'tag-2'];

      mockPrismaService.collectionTag.deleteMany.mockResolvedValue({ count: 0 });
      mockPrismaService.collectionTag.createMany.mockResolvedValue({ count: 2 });

      await service.assignTagsToCollection(collectionId, tagIds);

      expect(mockPrismaService.collectionTag.deleteMany).toHaveBeenCalledWith({
        where: { collection_id: collectionId },
      });
      expect(mockPrismaService.collectionTag.createMany).toHaveBeenCalledWith({
        data: [
          { collection_id: collectionId, tag_id: 'tag-1' },
          { collection_id: collectionId, tag_id: 'tag-2' },
        ],
      });
    });

    it('should handle empty tag list', async () => {
      const collectionId = 'collection-1';
      const tagIds: string[] = [];

      mockPrismaService.collectionTag.deleteMany.mockResolvedValue({ count: 0 });

      await service.assignTagsToCollection(collectionId, tagIds);

      expect(mockPrismaService.collectionTag.deleteMany).toHaveBeenCalledWith({
        where: { collection_id: collectionId },
      });
      expect(mockPrismaService.collectionTag.createMany).not.toHaveBeenCalled();
    });
  });
});
