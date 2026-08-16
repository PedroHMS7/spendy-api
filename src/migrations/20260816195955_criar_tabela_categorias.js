exports.up = function(knex) {
    return knex.schema.createTable('categorias', function(table) {
        table.increments('id');
        table.string('nome', 100).notNullable();
        table.enum('tipo', ['receita','despesa']).notNullable();
        table.integer('usuario_id').unsigned().notNullable();
        table.foreign('usuario_id').references('id').inTable('usuarios');
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable('categorias');
}