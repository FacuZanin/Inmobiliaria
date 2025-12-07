require('dotenv').config();
const { DataSource } = require('typeorm');

console.log("ENTIDADES CARGADAS POR TYPEORM CLI:");
console.log(require('./dist/agencias/entities/agencia.entity.js'));
console.log(require('./dist/users/user.entity/user.entity.js'));
console.log(require('./dist/propiedades/entities/propiedad.entity.js'));
console.log(require('./dist/operaciones/entities/operacion.entity.js'));


module.exports = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  entities: [
    require('./dist/agencias/entities/agencia.entity.js').Agencia,
    require('./dist/operaciones/entities/operacion.entity.js').Operacion,
    require('./dist/propiedades/entities/propiedad.entity.js').Propiedad,
    require('./dist/users/user.entity/user.entity.js').User,
  ],

  migrations: ["dist/database/migrations/*.js"],

  synchronize: false,
  migrationsRun: false,
});
