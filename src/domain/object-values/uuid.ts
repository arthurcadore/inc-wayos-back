import { validate ,v4 as uuidv4 } from 'uuid';

export class UUID {
    constructor(private readonly value: string) {}

    toString(): string {
        return this.value;
    }

    static generate(): UUID {
        return new UUID(uuidv4());
    }

    static fromString(value: string): UUID {
        return new UUID(value);
    }

    static isValidUUID(value: string): boolean {
        return validate(value);
    }

    isEqual(other: UUID): boolean {
        return this.value === other.value;
    }
}
