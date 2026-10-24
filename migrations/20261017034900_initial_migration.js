/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema
    .createTable("site", (table) => {
      table.increments();
      table.text("name").notNullable();
      table.text("url").notNullable();
      table.timestamps(true, true);
    })
    .createTable("category", (table) => {
      table.increments();
      table.boolean("is_starred");
      table
        .bigint("site_id")
        .references("site.id")
        .onDelete("CASCADE")
        .notNullable();
      table.text("text").notNullable();
      table.timestamps(true, true);
      table.unique(["site_id", "text"]);
    })
    .createTable("page", (table) => {
      table.increments();
      table
        .bigint("site_id")
        .references("site.id")
        .onDelete("CASCADE")
        .notNullable();
      table.text("title").notNullable();
      table.text("url").notNullable();
      table.boolean("is_new").notNullable().defaultTo(true);
      table.boolean("is_starred").notNullable().defaultTo(false);
      table.timestamps(true, true);
    })
    .createTable("page_category", (table) => {
      table.increments();
      table
        .bigint("page_id")
        .references("page.id")
        .onDelete("CASCADE")
        .notNullable();
      table
        .bigint("category_id")
        .references("category.id")
        .onDelete("CASCADE")
        .notNullable();
      table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema 
    .dropTableIfExists("page_category")
    .dropTableIfExists("page")
    .dropTableIfExists("category")
    .dropTableIfExists("site");
};
