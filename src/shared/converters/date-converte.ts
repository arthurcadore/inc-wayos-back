export class DateConverter {
    /**
     * @description Converts a Date object to a string in the format "yyyy-MM-dd HH:mm:ss" no formato ISO 8601.
     * @param date Objeto Date a ser convertido
     * @returns string
     */
    public static toISO8601(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    /**
     * @description Converts a string in the format "yyyy-MM-dd HH:mm:ss" to a Date object.
     * @param dateString string a ser convertido
     * @returns Date object
     */
    public static fromISO8601(dateString: string): Date {
        return new Date(dateString);
    }

    /**
     * @description Converts a Date object to a Unix timestamp (seconds since epoch).
     * @param date Objeto Date a ser convertido
     * @returns number
     */
    public static toTimestamp(date: Date): number {
        return Math.floor(date.getTime() / 1000);
    }

    /**
     * @description Cria as datas de início e fim no formato ISO 8601 para o intervalo de dias definido
     * @param daysRange Representa o número de dias para o intervalo
     * @returns Objeto com as datas de início (startAt) e fim (endAt)
     */
    public static createRangeDates(daysRange: number): { startAt: string; endAt: string } {
        const endAtDate = new Date();
        const startAtDate = new Date(endAtDate);
        startAtDate.setDate(startAtDate.getDate() - daysRange);
        const startAt = DateConverter.toISO8601(startAtDate);
        const endAt = DateConverter.toISO8601(endAtDate);
        return { startAt, endAt };
    }
}
