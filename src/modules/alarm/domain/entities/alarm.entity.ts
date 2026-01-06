import { UUID } from "src/domain/object-values/uuid";
import { AlarmComment } from "./alarm-comment.entity";

export class Alarm {
    private comments: AlarmComment[] = [];

    constructor(
        private readonly _id: UUID,
        private readonly _externalId: string,
        private _title: string,
        private _isSolved: boolean,
        private readonly _createdAt: Date,
        private _updatedAt: Date,
    ) {}

    get id(): UUID {
        return this._id;
    }

    get externalId(): string {
        return this._externalId;
    }

    get title(): string {
        return this._title;
    }

    get isSolved(): boolean {
        return this._isSolved;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    getComments(): AlarmComment[] {
        return this.comments;
    }

    // Crie um método para validar se um comentário pode ser adicionado usando regras de negócio
    private canAddComment(comment: AlarmComment): boolean {
        if (this.isSolved) {
            throw new Error("Não é possível adicionar comentários a um alarme resolvido.");
        }

        if (this.comments.find(c => c.id.toString() === comment.id.toString())) {
            throw new Error("Comentário já existe neste alarme.");
        }

        if (comment.alarmId.toString() !== this.id.toString()) {
            throw new Error("Comentário não pertence a este alarme.");
        }

        return true;
    }

    public addComment(comment: AlarmComment): void {
        this.canAddComment(comment);
        this.comments.push(comment);
    }

    public addComments(comments: AlarmComment[]): void {
        comments.forEach(comment => this.addComment(comment));
    }

    public markAsSolved(): void {
        this._isSolved = true;
        this._updatedAt = new Date();
    }
}
