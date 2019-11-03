const faker=require('faker');

exports.seed = function(knex) {
  function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  // Deletes ALL existing entries
  return knex('BOOK').del()
    .then(async ()=> {
      // Inserts seed entries
      let rows=[];
      for (let i = 0; i < 100; i++) {
        rows.push({
          id_user:1,
          title:faker.commerce.productName(),
          description:faker.lorem.paragraph(),
          publication_date:randomDate(new Date(1700, 0,0),new Date()),
          author:faker.name.firstName() + ' ' + faker.name.lastName()
        });
      }
      return await knex('BOOK').insert(rows);
    });
};
