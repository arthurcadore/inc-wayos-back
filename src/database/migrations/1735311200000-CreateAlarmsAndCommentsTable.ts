import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateAlarmsAndCommentsTable1735311200000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create alarms table
        await queryRunner.createTable(
            new Table({
                name: 'alarms',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'externalId',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'deviceType',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'isSolved',
                        type: 'boolean',
                        isNullable: false,
                        default: false,
                    },
                ],
            }),
            true,
        );

        // Create alarmComments table
        await queryRunner.createTable(
            new Table({
                name: 'alarmComments',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'text',
                        type: 'varchar',
                        length: '5000',
                        isNullable: false,
                    },
                    {
                        name: 'alarmId',
                        type: 'uuid',
                        isNullable: false,
                    },
                ],
            }),
            true,
        );

        // Create foreign key for alarmComments.alarmId -> alarms.id
        await queryRunner.createForeignKey(
            'alarmComments',
            new TableForeignKey({
                name: 'FK_alarmComments_alarmId',
                columnNames: ['alarmId'],
                referencedTableName: 'alarms',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        );

        // Create indexes for alarms table
        await queryRunner.createIndex(
            'alarms',
            new TableIndex({
                name: 'IDX_alarms_external_id',
                columnNames: ['externalId'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes from alarms table
        await queryRunner.dropIndex('alarms', 'IDX_alarms_external_id');

        // Drop foreign key from alarmComments
        await queryRunner.dropForeignKey('alarmComments', 'FK_alarmComments_alarmId');

        // Drop tables
        await queryRunner.dropTable('alarmComments');
        await queryRunner.dropTable('alarms');
    }
}
