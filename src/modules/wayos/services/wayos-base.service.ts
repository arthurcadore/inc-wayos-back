import * as crypto from 'crypto';

export abstract class WayosBaseService {
    protected readonly appId: string = process.env.WAYOS_ACCESS_KEY_ID!;
    protected readonly secretKey: string = process.env.WAYOS_ACCESS_KEY_SECRET!;

    public buildSignature(
        timestamp: number,
        bodyParams: Record<string, unknown>,
    ): string {
        const signData = {
            'X-App-Id': this.appId,
            'X-App-Secret': this.secretKey,
            'X-Timestamp': timestamp,
        };

        // Adiciona todos os campos do body no sign_data
        for (const [key, value] of Object.entries(bodyParams)) {
            signData[key] = value;
        }

        // Ordena as chaves em ordem alfabética
        const orderedKeys = Object.keys(signData).sort();

        // Concatena os valores na ordem correta
        const concatenatedArray: string[] = [];
        for (const key of orderedKeys) {
            const value: unknown = signData[key];
            if (typeof value === 'object' && value !== null) {
                concatenatedArray.push(JSON.stringify(value));
            } else {
                concatenatedArray.push(String(value));
            }
        }
        const concatenatedString = concatenatedArray.join('');

        // SHA1 → MD5
        const sha1 = crypto
            .createHash('sha1')
            .update(concatenatedString, 'utf8')
            .digest('hex');
        const md5 = crypto.createHash('md5').update(sha1, 'utf8').digest('hex');

        return md5;
    }

    private pad(num: number) {
        return num.toString().padStart(2, '0');
    }

    public generateRequestId(): string {
        const now = new Date();
        const timestampStr = `${now.getFullYear()}${this.pad(now.getMonth() + 1)}${this.pad(now.getDate())}${this.pad(now.getHours())}${this.pad(now.getMinutes())}${this.pad(now.getSeconds())}`;
        const milliseconds = now.getMilliseconds().toString().padStart(3, '0');
        const randomDigits = Math.floor(Math.random() * 900000) + 1000;

        return `${timestampStr}${milliseconds}${randomDigits}`;
    }
}
