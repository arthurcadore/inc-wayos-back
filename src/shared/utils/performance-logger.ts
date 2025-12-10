export class PerformanceLogger {
    /**
     * @description Calcula e exibe o tamanho dos dados fornecidos em um formato legível (Bytes, KB, MB, GB).
     * @param value Os dados cujo tamanho deve ser calculado.
     * @returns Uma string representando o tamanho dos dados em Bytes, KB, MB ou GB.
     */
    public static dataSize(value: any): string {
        const dataSizeInBytes = Buffer.byteLength(JSON.stringify(value), 'utf8');

        if (dataSizeInBytes < 1024) {
            return `${dataSizeInBytes} Bytes`;
        } else if (dataSizeInBytes < 1024 * 1024) {
            const dataSizeInKB = (dataSizeInBytes / 1024).toFixed(2);
            return `${dataSizeInKB} KB`;
        } else if (dataSizeInBytes < 1024 * 1024 * 1024) {
            const dataSizeInMB = (dataSizeInBytes / (1024 * 1024)).toFixed(2);
            return `${dataSizeInMB} MB`;
        } else {
            const dataSizeInGB = (dataSizeInBytes / (1024 * 1024 * 1024)).toFixed(2);
            return `${dataSizeInGB} GB`;
        }
    }

    /**
     * @description Calcula e exibe o tamanho dos dados fornecidos no console em um formato legível (Bytes, KB, MB, GB).
     * @param value Os dados cujo tamanho deve ser calculado.
     * @param name O nome dos dados para exibição no console.
     */
    public static logDataSize(value: any, name: string): void {
        if (process.env.NODE_ENV === 'production') {
            return;
        }

        const dataSize = this.dataSize(value);
        console.log(`Tamanho dos dados do ${name} recebidos: ${dataSize}`);
    }
}
