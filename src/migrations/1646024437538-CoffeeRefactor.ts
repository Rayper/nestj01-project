import {MigrationInterface, QueryRunner} from "typeorm";

export class CoffeeRefactor1646024437538 implements MigrationInterface {

    // up untuk mengatasi apa yang akan dirubah
    // bikin manual
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "coffee" RENAME COLUMN "name" to "title"`,
        );
    }

    // down untu rollback / undo
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "coffee" RENAME COLUMN "title" to "name"`,
        );
    }

}
