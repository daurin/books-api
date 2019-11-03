const faker=require('faker');

exports.seed = async (knex) => {
  // Deletes ALL existing entries
  return knex('USER').del()
    .then(function () {
      // Inserts seed entries
      let rows=[];
      for (let i = 0; i < 50; i++) {
        rows.push({
          name: faker.name.firstName() + ' ' + faker.name.lastName()
        })
      }
      return knex('USER').insert(rows);
    });
};
