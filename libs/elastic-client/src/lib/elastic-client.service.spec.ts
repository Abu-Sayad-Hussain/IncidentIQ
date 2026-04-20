import { Test, TestingModule } from '@nestjs/testing';
import { ElasticClientService } from './elastic-client.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';

describe('ElasticClientService', () => {
  let service: ElasticClientService;
  let mockEsService: any;

  beforeEach(async () => {
    mockEsService = {
      indices: {
        exists: jest.fn().mockResolvedValue(false),
        create: jest.fn().mockResolvedValue(true),
      },
      index: jest.fn().mockResolvedValue({ _id: '1', result: 'created' }),
      search: jest.fn().mockResolvedValue({ hits: { hits: [] } }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElasticClientService,
        {
          provide: ElasticsearchService,
          useValue: mockEsService,
        },
      ],
    }).compile();

    service = module.get<ElasticClientService>(ElasticClientService);
  });

  it('should auto-create the incident-iq-logs index on module init', async () => {
    await service.onModuleInit();
    expect(mockEsService.indices.exists).toHaveBeenCalledWith({ index: 'incident-iq-logs' });
    expect(mockEsService.indices.create).toHaveBeenCalled();
  });

  it('should successfully pass formatted log payloads to elastic', async () => {
    const payload = {
      serviceName: 'elastic-test',
      level: 'ERROR' as const,
      message: 'Failed to connect',
      timestamp: new Date().toISOString(),
    };

    const result = await service.indexLog(payload);
    expect(result).toEqual({ _id: '1', result: 'created' });
    expect(mockEsService.index).toHaveBeenCalledWith({
      index: 'incident-iq-logs',
      body: payload,
    });
  });

  it('should securely format search queries', async () => {
    await service.searchLogs('database timeout', 10);
    expect(mockEsService.search).toHaveBeenCalledWith({
      index: 'incident-iq-logs',
      body: {
        size: 10,
        query: {
          multi_match: {
            query: 'database timeout',
            fields: ['message', 'serviceName', 'level'],
          },
        },
        sort: [{ timestamp: { order: 'desc' } }],
      },
    });
  });
});
