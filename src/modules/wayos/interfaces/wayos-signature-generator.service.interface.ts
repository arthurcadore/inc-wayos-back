export interface WayosSignatureServiceInterface {
    buildSignature(
        timestamp: string,
        bodyParams: Record<string, unknown>,
    ): string;
    generateRequestId(): string;
}
