import { UUID } from "src/domain/object-values/uuid";

export class AlarmComment {
    constructor(
        private readonly _id: UUID,
        private _text: string,
        private readonly _alarmId: UUID,
        private readonly _createdAt: Date,
        private _updatedAt: Date,
    ) {}

    get id(): UUID {
        return this._id;
    }

    get text(): string {
        return this._text;
    }

    get alarmId(): UUID {
        return this._alarmId;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    setText(newText: string): void {
        this._text = newText;
        this._updatedAt = new Date();
    }
}
