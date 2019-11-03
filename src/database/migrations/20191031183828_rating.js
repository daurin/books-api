
exports.up = (knex) => {
    return Promise.all([
        knex.schema.hasTable('USER'),
        knex.schema.hasTable('BOOK'),
    ])
        .then((exists) => {
            if (exists.every((v)=>v===true)) {
                return knex.schema.createTable("RATING", table => {
                    table.integer('id_book').unsigned();
                    table.integer('id_user').unsigned();
                    table.specificType('vote', 'TINYINT');
                    table.string('commentary', 50);
                    table.foreign('id_book').references('BOOK.id').onDelete('SET NULL').onUpdate('SET NULL');
                    table.foreign('id_user').references('USER.id').onDelete('SET NULL').onUpdate('SET NULL');
                    table.unique(['id_book', 'id_user']);
                });
            }
        });
};

exports.down = (knex) => {
    return knex.schema.dropTableIfExists('RATING');
};