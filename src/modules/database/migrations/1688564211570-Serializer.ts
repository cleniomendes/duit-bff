import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Serializer1688564211570 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'serializer',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
          },
          {
            name: 'method',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'objectField',
            type: 'json',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'now()',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('serializer');
  }
}
