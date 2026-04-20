import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../../ingestion-service/src/app/app.controller';

describe('Ingestion Controller Flow', () => {
  let appController: AppController;
  let mockKafkaClient: any;

  beforeAll(async () => {
    mockKafkaClient = { emit: jest.fn() };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: 'KAFKA_SERVICE', useValue: mockKafkaClient }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should successfully parse and proxy logs to Kafka', async () => {
    const payload = {
      serviceName: 'e2e-test',
      level: 'INFO',
      message: 'Integration test log',
      timestamp: new Date().toISOString(),
    };

    const res = await appController.ingestLog(payload as any);
    expect(res.status).toBe('Ingested Successfully');
    expect(mockKafkaClient.emit).toHaveBeenCalledWith('logs.ingested', JSON.stringify(payload));
  });
});
