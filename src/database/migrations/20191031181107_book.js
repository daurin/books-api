
exports.up = (knex) => {
    return knex.schema.hasTable('USER').then((exist) => {
        if (exist) {
            return knex.schema.createTable("BOOK", table => {
                table.increments('id').unsigned().primary().defaultTo('AUTO_INCREMENT').notNullable();
                table.integer('id_user').unsigned();
                table.string('title', 40).notNullable();
                table.text('description');
                table.date('publication_date').notNullable();
                table.string('author', 30);
                table.index(['title', 'author'], 'title_author', 'FULLTEXT');
                table.foreign('id_user').references('USER.id').onDelete('SET NULL').onUpdate('SET NULL');

            });
        }
    });
};

exports.down = async (knex) => {
    await knex.schema.dropTableIfExists('BOOK');
};