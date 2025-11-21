import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { IWayosSignatureService } from '../interfaces/wayos-signature-generator.service.interface';

@Injectable()
export class WayosSignatureService implements IWayosSignatureService {
    constructor(
        private readonly appId: string,
        private readonly secretKey: string,
    ) {}

    buildSignature(timestamp: string, bodyParams: Record<string, unknown>): string {
        const signData: Record<string, unknown> = {
            'X-App-Id': this.appId,
            'X-App-Secret': this.secretKey,
            'X-Timestamp': timestamp,
            ...bodyParams,
        };

        // Ordena as chaves
        const orderedKeys = Object.keys(signData).sort();

        // Concatena valores na ordem
        const signStr = orderedKeys.map(key => String(signData[key])).join('');

        // SHA1 → MD5
        const sha1 = crypto.createHash('sha1').update(signStr, 'utf8').digest('hex');
        const md5 = crypto.createHash('md5').update(sha1, 'utf8').digest('hex');

        return md5;
    }

    generateRequestId(): string {
        const now = new Date();

        const pad = (num: number, size: number) => num.toString().padStart(size, '0');

        const year = now.getFullYear();
        const month = pad(now.getMonth() + 1, 2);
        const day = pad(now.getDate(), 2);

        const hour = pad(now.getHours(), 2);
        const minute = pad(now.getMinutes(), 2);
        const second = pad(now.getSeconds(), 2);

        const milliseconds = pad(now.getMilliseconds(), 3);

        // Gera 6 dígitos aleatórios
        const random = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');

        return `${year}${month}${day}${hour}${minute}${second}${milliseconds}${random}`;
    }
}
