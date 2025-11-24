export interface WayosBaseServiceInterface {
    buildSignature(
        timestamp: number,
        bodyParams: Record<string, unknown>,
    ): string;
    generateRequestId(): string;
}
