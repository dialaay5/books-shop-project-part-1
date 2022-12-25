const sqlite3 = require('sqlite3').verbose();
const db_file_location = './db_data.db'

function open_db(file_name) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(file_name, (err) => {
            if (err) {
                console.log(`Failed to connect to ${file_name}`);
                reject(err)
            }
            else {
                console.log(`Successfully connected to ${file_name}`);
                resolve(db)
            }
        })
    })
}
//to get all the orders
function get_all(db, query) {
    return new Promise((resolve, reject) => {
        db.all(query, (err, rows) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(rows)
            }
        });
    });
}
//to get order by the id
function get_by_id(db, id) {
    return new Promise((resolve, reject) => {
        const sql_select_by_id = `SELECT * FROM ORDERS
                             WHERE id = "${id}";`
        db.get(sql_select_by_id, (err, row) => {
            if (err) {
                console.log(`ERROR: ${err}`);
                reject(err)
            }
            else {
                resolve(row)
            }

        });
    });

}
//to get order by the customer last name
function find_by_lname(db, customer_lname) {
    return new Promise((resolve, reject) => {
        const sql_find_by_lname = `SELECT * FROM ORDERS
                               WHERE CUSTOMER_LNAME like "%${customer_lname}%";`
        db.get(sql_find_by_lname, (err, row) => {
            if (err) {
                console.log(`ERROR: ${err}`);
                reject(err)
            }
            else {
                resolve(row)
            }

        });
    });
}
//to add another order
function  insert_order(db, data) {
    return new Promise(function (resolve, reject) {
        const sql_insert = `INSERT INTO ORDERS (HOW_MANY, TIME_OF_ORDERS, CUSTOMER_FNAME, CUSTOMER_LNAME, CREDIT_CARD, BOOK_ID)
                        VALUES (?, ? ,?, ?, ?, ?);`
        db.run(sql_insert, data, err => {
            if (err) {
                console.log(`ERROR: ${err}`);
                reject(err)
            }
            else {
                console.log(`INSERTED ${data}`);
                resolve()

            }
        })
    })

}
//Update an existing order
//to update the credit card number for example
function update(db, id, new_credit_card) {
    return new Promise(function (resolve, reject) {
        const sql_update = `UPDATE orders 
                        SET credit_card = ?
                        WHERE id = ? ;`
        db.run(sql_update, [new_credit_card, id], err => {
            if (err) {
                console.log(`ERROR: ${err}`);
                reject(err)

            }
            else {
                console.log(`credit card updated to ${new_credit_card}`);
                resolve(`${new_credit_card}`)
            }
        })
    })
}
//delete an existing order
function delete_order_by_id(db, id) {
    return new Promise((resolve, reject) => {
        const sql_delet = `DELETE FROM ORDERS WHERE ID = ?;`
        db.run(sql_delet, [id], err => {
            if (err) {
                console.log(`ERROR: ${err}`);
                reject(err)

            }
            else {
                console.log(`id ${id} deleted`);
                resolve()

            }

        })
    })
}

function close_db(db) {
    return new Promise((resolve, reject) => {
        db.close(err => {
            if (err) {
                console.log(err.message);
                reject(err.message)
            }
            else {
                console.log('Database connection closed!');
                resolve()
            }
        })
    })
}
//ייצרתי פונקצייה שנותנת לי את השעה והתאריך כדי להשתמש בה בפונקצייה של הוספת הזמנה חדשה
let date = new Date();
function creatDate() {
    return date.toLocaleString(); 
}

async function mainOrder() {
    try {
        const db = await open_db(db_file_location)
        console.log(db);
        const result1 = await get_all(db, "SELECT * from ORDERS");
        console.log(result1);
        const result2 = await get_by_id(db, 1);
        console.log(result2);
        const result3 = await find_by_lname(db, 'ams');
        console.log(result3);
        //await insert_order(db, [1, creatDate(),'SUZI','Perez','5326 1806 7522 1103',1])
        await update(db, 1, '5326 1111 002 3121')
        //await delete_order_by_id(db, 8)
        await close_db(db)
    }
    catch (err) {
        console.log(`ERROR: ${err}`);
    }
}
mainOrder()








