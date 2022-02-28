import {MigrationInterface, QueryRunner} from "typeorm";

export class SchemaSync1646026015145 implements MigrationInterface {
    name = 'SchemaSync1646026015145'

    // bikin otomatis pakai command cli 
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" ADD "description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coffee" DROP COLUMN "description"`);
    }

}
