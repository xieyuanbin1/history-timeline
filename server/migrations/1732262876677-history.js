const {Table} = require("typeorm");

module.exports = class History1732262876677 {

  async up(queryRunner) {
    // timeline 表
    await queryRunner.createTable(
      new Table({
        name: 'timeline',
        columns: [
          {name: 'id', type: 'uuid', generationStrategy: 'uuid', isPrimary: true, isGenerated: true},
          {name: 'name', type: 'varchar', isUnique: true},
          {name: 'title', type: 'uuid'},
          {name: 'events', type: 'uuid'},
          {name: 'weight', type: 'int', default: 0},
        ]
      }),
      true
    );

    // slides 表
    await queryRunner.createTable(
      new Table({
        name: 'slides',
        columns: [
          {name: 'id', type: 'uuid', generationStrategy: 'uuid', isPrimary: true, isGenerated: true},
          {name: 'sid', type: 'uuid'},
          {name: 'start_date', type: 'uuid'},
          {name: 'end_date', type: 'uuid'},
          {name: 'text', type: 'uuid'},
          {name: 'media', type: 'uuid'},
          {name: 'group', type: 'varchar', isNullable: true},
          {name: 'display_date', type: 'varchar', isNullable: true},
          {name: 'background', type: 'uuid'},
          {name: 'autolink', type: 'boolean', isNullable: true},
          {name: 'unique_id', type: 'varchar', isNullable: true},
        ]
      }),
      true
    );

    // date 表
    await queryRunner.createTable(
      new Table({
        name: 'date',
        columns: [
          {name: 'id', type: 'uuid', generationStrategy: 'uuid', isPrimary: true, isGenerated: true},
          {name: 'did', type: 'uuid'},
          {name: 'year', type: 'int'},
          {name: 'month', type: 'int', isNullable: true},
          {name: 'day', type: 'int', isNullable: true},
          {name: 'hour', type: 'int', isNullable: true},
          {name: 'minute', type: 'int', isNullable: true},
          {name: 'second', type: 'int', isNullable: true},
          {name: 'millisecond', type: 'int', isNullable: true},
          {name: 'display_date', type: 'varchar', isNullable: true},
          {name: 'format', type: 'varchar', isNullable: true},
        ]
      }),
      true
    );

    // text 表
    await queryRunner.createTable(
      new Table({
        name: 'text',
        columns: [
          {name: 'id', type: 'uuid', generationStrategy: 'uuid', isPrimary: true, isGenerated: true},
          {name: 'tid', type: 'uuid'},
          {name: 'headline', type: 'varchar', isNullable: true},
          {name: 'text', type: 'varchar', isNullable: true},
        ]
      }),
      true
    );

    // media 表
    await queryRunner.createTable(
      new Table({
        name: 'media',
        columns: [
          {name: 'id', type: 'uuid', generationStrategy: 'uuid', isPrimary: true, isGenerated: true},
          {name: 'mid', type: 'uuid'},
          {name: 'url', type: 'varchar'},
          {name: 'caption', type: 'varchar', isNullable: true},
          {name: 'credit', type: 'varchar', isNullable: true},
          {name: 'thumbnail', type: 'varchar', isNullable: true},
          {name: 'alt', type: 'varchar', isNullable: true},
          {name: 'title', type: 'varchar', isNullable: true},
          {name: 'link', type: 'varchar', isNullable: true},
          {name: 'link_target', type: 'varchar', isNullable: true},
        ]
      }),
      true
    );

    // background 表
    await queryRunner.createTable(
      new Table({
        name: 'background',
        columns: [
          {name: 'id', type: 'uuid', generationStrategy: 'uuid', isPrimary: true, isGenerated: true},
          {name: 'bid', type: 'uuid'},
          {name: 'url', type: 'varchar'},
          {name: 'alt', type: 'varchar', isNullable: true},
          {name: 'color', type: 'int', isNullable: true},
        ]
      }),
      true
    );
  }

  async down(queryRunner) {
    await queryRunner.dropTable('timeline', true);
    await queryRunner.dropTable('slides', true);
    await queryRunner.dropTable('date', true);
    await queryRunner.dropTable('text', true);
    await queryRunner.dropTable('media', true);
    await queryRunner.dropTable('background', true);
  }

}
