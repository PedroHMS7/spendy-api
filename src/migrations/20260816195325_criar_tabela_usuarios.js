exports.up = function(knex) {
    return knex.schema.createTable('usuarios',function(table) {
        table.increments('id');
        table.string('nome', 100).notNullable();
        table.string('email', 150).unique().notNullable();
        table.string('senha_hash', 255).notNullable();
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable('usuarios');
}