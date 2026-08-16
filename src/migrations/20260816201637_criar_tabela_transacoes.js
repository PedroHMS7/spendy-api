exports.up = function(knex) {
    return knex.schema.createTable('transacoes', function(table) {
        table.increments('id');
        table.string('descricao', 100).notNullable();
        table.decimal('valor', 10, 2).notNullable();
        table.enum('tipo', ['receita','despesa']).notNullable();
        table.datetime('data').notNullable();
        table.integer('categoria_id').unsigned().notNullable();
        table.integer('usuario_id').unsigned().notNullable();
        table.foreign('categoria_id').references('id').inTable('categorias');
        table.foreign('usuario_id').references('id').inTable('usuarios');
    })
}

exports.down = function(knex) {
    return knex.schema.dropTable('transacoes');
}