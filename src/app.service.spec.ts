import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

describe('AppService', () => {
    let service: AppService;
    let configService: ConfigService;

    const mockConfigService = {
        get: jest.fn()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AppService,
                {
                    provide: ConfigService,
                    useValue: mockConfigService
                }
            ]
        }).compile();

        service = module.get<AppService>(AppService);
        configService = module.get<ConfigService>(ConfigService);

        // Reset mocks before each test
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getHealthCheck', () => {
        it('should return health check with default values when config is not available', () => {
            // Arrange
            mockConfigService.get.mockReturnValue(undefined);

            // Act
            const result = service.getHealthCheck();

            // Assert
            expect(result).toHaveProperty('message', 'EACE Backend Dashboard is running!');
            expect(result).toHaveProperty('timestamp');
            expect(result).toHaveProperty('environment', 'development');
            expect(result).toHaveProperty('version', '0.0.1');
            expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

            expect(configService.get).toHaveBeenCalledWith('NODE_ENV');
            expect(configService.get).toHaveBeenCalledWith('APP_VERSION');
        });

        it('should return health check with configured values', () => {
            // Arrange
            mockConfigService.get.mockImplementation((key: string) => {
                switch (key) {
                    case 'NODE_ENV':
                        return 'production';
                    case 'APP_VERSION':
                        return '1.2.3';
                    default:
                        return undefined;
                }
            });

            // Act
            const result = service.getHealthCheck();

            // Assert
            expect(result).toEqual({
                message: 'EACE Backend Dashboard is running!',
                timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
                environment: 'production',
                version: '1.2.3'
            });

            expect(configService.get).toHaveBeenCalledWith('NODE_ENV');
            expect(configService.get).toHaveBeenCalledWith('APP_VERSION');
            expect(configService.get).toHaveBeenCalledTimes(2);
        });

        it('should return current timestamp for each call', () => {
            // Arrange
            mockConfigService.get.mockReturnValue('test-value');

            // Act
            const result1 = service.getHealthCheck();

            // Wait a small amount to ensure different timestamps
            const result2 = service.getHealthCheck();

            // Assert
            expect(result1.timestamp).toBeDefined();
            expect(result2.timestamp).toBeDefined();
            // The timestamps should be valid ISO strings
            expect(new Date(result1.timestamp).toISOString()).toBe(result1.timestamp);
            expect(new Date(result2.timestamp).toISOString()).toBe(result2.timestamp);
        });

        it('should handle different NODE_ENV values', () => {
            // Test cases for different environments
            const testCases = [
                { nodeEnv: 'development', expected: 'development' },
                { nodeEnv: 'homologation', expected: 'homologation' },
                { nodeEnv: 'production', expected: 'production' },
                { nodeEnv: null, expected: 'development' },
                { nodeEnv: '', expected: 'development' }
            ];

            testCases.forEach(({ nodeEnv, expected }) => {
                // Arrange
                mockConfigService.get.mockImplementation((key: string) => {
                    if (key === 'NODE_ENV') return nodeEnv;
                    if (key === 'APP_VERSION') return '1.0.0';
                    return undefined;
                });

                // Act
                const result = service.getHealthCheck();

                // Assert
                expect(result.environment).toBe(expected);

                // Reset for next iteration
                jest.clearAllMocks();
            });
        });

        it('should handle different APP_VERSION values', () => {
            // Test cases for different versions
            const testCases = [
                { version: '1.0.0', expected: '1.0.0' },
                { version: '2.1.3-beta', expected: '2.1.3-beta' },
                { version: null, expected: '0.0.1' },
                { version: '', expected: '0.0.1' }
            ];

            testCases.forEach(({ version, expected }) => {
                // Arrange
                mockConfigService.get.mockImplementation((key: string) => {
                    if (key === 'NODE_ENV') return 'development';
                    if (key === 'APP_VERSION') return version;
                    return undefined;
                });

                // Act
                const result = service.getHealthCheck();

                // Assert
                expect(result.version).toBe(expected);

                // Reset for next iteration
                jest.clearAllMocks();
            });
        });
    });
});
