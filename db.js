//const Pool = require('pg').Pool;
const pg = require('pg')

const connectionString = 
'postgres://postgres:123456789@tinaservice.cpgch8qv2cik.us-east-2.rds.amazonaws.com:5432/tinaservice'
//'postgresql://admintina@tinaservice:123456789aA@tinaservice.postgres.database.azure.com:5432/postgres' //ssl=true

/*var dbConfig = {
    user: 'postgres',
    password: '123456789',
    database: 'tinaservice',
    host: 'tinaservice.cpgch8qv2cik.us-east-2.rds.amazonaws.com',
    port: 5432
};*/

const client = new pg.Client(connectionString)
client.connect()
/*const pool = new Pool({
    user: "postgres",
    password: "123456",
    database: "TinaService",
    host: "localhost",
    port: 5432
});*/

/*client.query('SELECT * FROM public."GenerateNumber"', (err, res) => {
    console.log(err, res)
    client.end()
})*/
module.exports = client