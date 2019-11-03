// Update with your config settings.
const env=require('./src/config/env.json').development;

module.exports = {

    development: {
        client: 'mysql',
        connection: {
            host:env.host,
            database: env.db_name,
            user: env.db_user,
            password: env.db_password,
        },
        migrations: {
            directory: "src/database/migrations"
        },
        seeds: {
            directory: "src/database/seets"
        }
    },

};
