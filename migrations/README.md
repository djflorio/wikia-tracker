# Database Migrations

Create a migration with `pnpm migrate:make create_table_name`, then implement its
`up` and `down` functions. Run pending migrations with `pnpm migrate:latest`.

Use `pnpm migrate:status` to list migrations. `pnpm migrate:rollback` rolls back
the most recently applied batch. Do not edit migrations that have already run
on a shared database; create a new migration instead.