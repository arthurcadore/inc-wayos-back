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
     * @description Converte um valor de tamanho em bytes para um formato legível (Bytes, KB, MB, GB).
     * @param value O tamanho em bytes.
     * @returns Uma string representando o tamanho dos dados em Bytes, KB, MB ou GB.
     */
    public static bytesSize(value: number): string {
        if (value < 1024) {
            return `${value} Bytes`;
        } else if (value < 1024 * 1024) {
            const dataSizeInKB = (value / 1024).toFixed(2);
            return `${dataSizeInKB} KB`;
        } else if (value < 1024 * 1024 * 1024) {
            const dataSizeInMB = (value / (1024 * 1024)).toFixed(2);
            return `${dataSizeInMB} MB`;
        } else {
            const dataSizeInGB = (value / (1024 * 1024 * 1024)).toFixed(2);
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

    /**
     * @description Converte um valor de tempo em milissegundos para um formato legível em minutos e segundos.
     * @param duration Tempo em milissegundos.
     * @returns Uma string representando o tempo em minutos e segundos.
     */
    public static formatDuration(duration: number): string {
        const minutes = Math.floor(duration / 60000);
        const seconds = ((duration % 60000) / 1000).toFixed(0);
        return `${minutes} minutos e ${seconds} segundos`;
    }
}
