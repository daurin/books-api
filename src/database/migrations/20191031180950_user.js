
exports.up = (knex)=> {
  return knex.schema.createTable("USER",table=>{
      table.increments('id').unsigned().primary().defaultTo('AUTO_INCREMENT').notNullable();
      table.string('name',30);
  });
};

exports.down = async(knex)=> {
  await knex.schema.dropTableIfExists('USER');
};