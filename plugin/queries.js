const connection = require('../knexfile')[process.env.NODE_ENV || 'development']
const database = require('knex')(connection)

module.export = {
    getAll(){
        return database('public."GenerateNumber"')
    }
}
