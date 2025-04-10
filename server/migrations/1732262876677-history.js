const {Table} = require("typeorm");

module.exports = class History1732262876677 {

  async up(queryRunner) {
    // timeline 表
    await queryRunner.createTable(
      new Table({
        name: 'timeline',
        columns: [
          { name: 'id', type: 'uuid', generationStrategy: 'uuid', isPrimary: true, isGenerated: true },
          { name: 'name', type: 'varchar', isUnique: true },
          { name: 'weight', type: 'int', default: 0 },
          { name: 'create_time', type: 'timestamp', default: "datetime(CURRENT_TIMESTAMP, 'localtime')" },
          { name: 'update_time', type: 'timestamp', default: "datetime(CURRENT_TIMESTAMP, 'localtime')" },
        ]
      }),
      true
    );

    // eras 表
    await queryRunner.createTable(
      new Table({
        name: 'eras',
        columns: [
          { name: 'id', type: 'uuid', generationStrategy: 'uuid', isPrimary: true, isGenerated: true },
          { name: 'pid', type: 'varchar' },
          { name: 'create_time', type: 'timestamp', default: "datetime(CURRENT_TIMESTAMP, 'localtime')" },
          { name: 'update_time', type: 'timestamp', default: "datetime(CURRENT_TIMESTAMP, 'localtime')" },
        ]
      }),
      true
    );

    // slide 表
    await queryRunner.createTable(
      new Table({
        name: 'slide',
        columns: [
          { name: 'id', type: 'uuid', generationStrategy: 'uuid', isPrimary: true, isGenerated: true },
          { name: 'pid', type: 'varchar' },
          { name: 'type', type: 'varchar' },
          { name: 'group', type: 'varchar', isNullable: true },
          { name: 'display_date', type: 'varchar', isNullable: true },
          { name: 'autolink', type: 'boolean', isNullable: true },
          { name: 'unique_id', type: 'varchar', isNullable: true },
          { name: 'weight', type: 'int', default: 0 },
          { name: 'create_time', type: 'timestamp', default: "datetime(CURRENT_TIMESTAMP, 'localtime')" },
          { name: 'update_time', type: 'timestamp', default: "datetime(CURRENT_TIMESTAMP, 'localtime')" },
        ]
      }),
      true
    );

    // date 表
    await queryRunner.createTable(
      new Table({
        name: 'date',
        columns: [
          { name: 'id', type: 'uuid', generationStrategy: 'uuid', isPrimary: true, isGenerated: true },
          { name: 'pid', type: 'varchar' },
          { name: 'type', type: 'int' },
          { name: 'year', type: 'int' },
          { name: 'month', type: 'int', isNullable: true },
          { name: 'day', type: 'int', isNullable: true },
          { name: 'hour', type: 'int', isNullable: true },
          { name: 'minute', type: 'int', isNullable: true },
          { name: 'second', type: 'int', isNullable: true },
          { name: 'millisecond', type: 'int', isNullable: true },
          { name: 'display_date', type: 'varchar', isNullable: true },
          { name: 'format', type: 'varchar', isNullable: true },
          { name: 'create_time', type: 'timestamp', default: "datetime(CURRENT_TIMESTAMP, 'localtime')" },
          { name: 'update_time', type: 'timestamp', default: "datetime(CURRENT_TIMESTAMP, 'localtime')" },
        ]
      }),
      true
    );

    // text 表
    await queryRunner.createTable(
      new Table({
        name: 'text',
        columns: [
          { name: 'id', type: 'uuid', generationStrategy: 'uuid', isPrimary: true, isGenerated: true },
          { name: 'pid', type: 'varchar' },
          { name: 'headline', type: 'varchar', isNullable: true },
          { name: 'text', type: 'varchar', isNullable: true },
          { name: 'create_time', type: 'timestamp', default: "datetime(CURRENT_TIMESTAMP, 'localtime')" },
          { name: 'update_time', type: 'timestamp', default: "datetime(CURRENT_TIMESTAMP, 'localtime')" },
        ]
      }),
      true
    );

    // media 表
    await queryRunner.createTable(
      new Table({
        name: 'media',
        columns: [
          { name: 'id', type: 'uuid', generationStrategy: 'uuid', isPrimary: true, isGenerated: true },
          { name: 'pid', type: 'varchar' },
          { name: 'url', type: 'varchar' },
          { name: 'caption', type: 'varchar', isNullable: true },
          { name: 'credit', type: 'varchar', isNullable: true },
          { name: 'thumbnail', type: 'varchar', isNullable: true },
          { name: 'alt', type: 'varchar', isNullable: true },
          { name: 'title', type: 'varchar', isNullable: true },
          { name: 'link', type: 'varchar', isNullable: true },
          { name: 'link_target', type: 'varchar', isNullable: true },
          { name: 'create_time', type: 'timestamp', default: "datetime(CURRENT_TIMESTAMP, 'localtime')" },
          { name: 'update_time', type: 'timestamp', default: "datetime(CURRENT_TIMESTAMP, 'localtime')" },
        ]
      }),
      true
    );

    // background 表
    await queryRunner.createTable(
      new Table({
        name: 'background',
        columns: [
          { name: 'id', type: 'uuid', generationStrategy: 'uuid', isPrimary: true, isGenerated: true },
          { name: 'pid', type: 'varchar' },
          { name: 'url', type: 'varchar', isNullable: true },
          { name: 'alt', type: 'varchar', isNullable: true },
          { name: 'color', type: 'int', isNullable: true },
          { name: 'create_time', type: 'timestamp', default: "datetime(CURRENT_TIMESTAMP, 'localtime')" },
          { name: 'update_time', type: 'timestamp', default: "datetime(CURRENT_TIMESTAMP, 'localtime')" },
        ]
      }),
      true
    );
  }

  async down(queryRunner) {
    await queryRunner.dropTable('timeline', true);
    await queryRunner.dropTable('slide', true);
    await queryRunner.dropTable('eras', true);
    await queryRunner.dropTable('date', true);
    await queryRunner.dropTable('text', true);
    await queryRunner.dropTable('media', true);
    await queryRunner.dropTable('background', true);
  }

}
