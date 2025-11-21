import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WayosService } from './modules/wayos/services/wayos.service';

describe('AppController', () => {
    let appController: AppController;
    let appService: AppService;

    const mockConfigService = {
        get: jest.fn(),
    };

    const mockWayosService = {
        getDeviceInfo: jest.fn(),
    };

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [
                AppService,
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
                {
                    provide: WayosService,
                    useValue: mockWayosService,
                },
            ],
        }).compile();

        appController = app.get<AppController>(AppController);
        appService = app.get<AppService>(AppService);

        // Reset mocks before each test
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(appController).toBeDefined();
    });

    describe('getHealthCheck', () => {
        it('should return health check information', () => {
            // Arrange
            const mockHealthCheck = {
                message: 'EACE Backend Dashboard is running!',
                timestamp: '2025-11-05T10:00:00.000Z',
                environment: 'development',
                version: '0.0.1',
            };

            jest.spyOn(appService, 'getHealthCheck').mockReturnValue(
                mockHealthCheck,
            );

            // Act
            const result = appController.getHealthCheck();

            // Assert
            expect(result).toEqual(mockHealthCheck);

            expect(appService.getHealthCheck).toHaveBeenCalledTimes(1);
        });

        it('should call AppService getHealthCheck method', () => {
            // Arrange
            const spy = jest.spyOn(appService, 'getHealthCheck');
            mockConfigService.get.mockReturnValue('test-value');

            // Act
            appController.getHealthCheck();

            // Assert
            expect(spy).toHaveBeenCalled();
        });

        it('should return object with required properties', () => {
            // Arrange
            mockConfigService.get.mockImplementation((key: string) => {
                switch (key) {
                    case 'NODE_ENV':
                        return 'production';
                    case 'APP_VERSION':
                        return '1.0.0';
                    default:
                        return undefined;
                }
            });

            // Act
            const result = appController.getHealthCheck();

            // Assert
            expect(result).toHaveProperty('message');
            expect(result).toHaveProperty('timestamp');
            expect(result).toHaveProperty('environment');
            expect(result).toHaveProperty('version');
            expect(typeof result.message).toBe('string');
            expect(typeof result.timestamp).toBe('string');
            expect(typeof result.environment).toBe('string');
            expect(typeof result.version).toBe('string');
        });
    });
});
