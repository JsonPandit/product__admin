var mysql=require("mysql")
var pool=mysql.createPool({
    host:'localhost',
    port:3306,
    user:'root',
    password:'pandit@sql',
    database:'productdata',
    multipleStatements:true,
    connectionLimit:100
})

module.exports = pool;