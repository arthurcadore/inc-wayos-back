export interface IWayosSignatureService {
    buildSignature(
        timestamp: string,
        bodyParams: Record<string, unknown>,
    ): string;
    generateRequestId(): string;
}
