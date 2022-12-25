const sqlite3 = require('sqlite3').verbose();
const db_file_loc = './db_data.db'

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
//to get all the bookss
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
//to get book by the id
function get_by_id(db, id) {
    return new Promise((resolve, reject) => {
        const sql_select_by_id = `SELECT * FROM BOOKS
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
//to get book by the title
function find_by_title(db, title) {
    return new Promise((resolve, reject) => {
        const sql_find_by_title = `SELECT * FROM BOOKS
                               WHERE TITLE like "%${title}%";`
        db.get(sql_find_by_title, (err, row) => {
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
//to add another book
function insert_books(db, data) {
    return new Promise(function (resolve, reject) {
        const sql_insert = `INSERT INTO BOOKS (TITLE, AUTHOR, PUBLISH_YEAR, PRICE, LEFT_IN_STOCK, BOOK_IMAGE_SRC)
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
//to update the price of the book for example
function update(db, id, new_price) {
    return new Promise(function (resolve, reject) {
        const sql_update = `UPDATE books 
                        SET price = ?
                        WHERE id = ? ;`
        db.run(sql_update, [new_price, id], err => {
            if (err) {
                console.log(`ERROR: ${err}`);
                reject(err)

            }
            else {
                console.log(`price updated to ${new_price}`);
                resolve(`${new_price}`)
            }
        })
    })
}
//delete an existing book
function delete_book_by_id(db, id) {
    return new Promise((resolve, reject) => {
        const sql_delet = `DELETE FROM BOOKS WHERE ID = ?;`
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

async function mainBook() {
    try {
        const db = await open_db(db_file_loc)
        console.log(db);
        const result1 = await get_all(db, "SELECT * from BOOKS");
        console.log(result1);
        const result2 = await get_by_id(db, 2);
        console.log(result2);
        const result3 = await find_by_title(db, 'ost');
        console.log(result3);
        //await insert_books(db, ['Safe Haven', 'Nicholas Sparks', 2010, 30, 6, 'IMAGE/book8.PNG'])
        await update(db, 1, 40)
        //await delete_book_by_id(db, 8)
        await close_db(db)
    }
    catch (err) {
        console.log(`ERROR: ${err}`);
    }
}
mainBook()


















