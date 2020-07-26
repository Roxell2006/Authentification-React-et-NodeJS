const mysql = require('mysql');

module.exports = class DataBase{
    
    constructor(){
        this.db = mysql.createConnection({
            host: 'localhost',
            port: 3308,            // port de connection MYSQL WAMP
            database: 'nodejs',
            user: 'root',
            password: ''
        })
    }
    // connection à la base de donnée
    connect(){
        return new Promise((resolve, reject)=>{
            this.db.connect((err) =>{
                if(err)     // erreur de connection à la base de donnée
                    reject(new Error(err.message));
                else       // Si on est connecté à la base de donnée...
                    resolve('Connecté');       
            })
        })
    }
    // recherche un utilisateur par son email
    searchByMail(email){
        return new Promise((resolve, reject)=>{
            this.db.query('SELECT * FROM authentification Where email=?', [email], (err, result)=>{
                if (err)
                    resolve(this.error(err.message));
                else{
                    if(result[0] != undefined)
                        resolve(this.success(result));
                    else
                        resolve(this.error("No Found !"));           
                }        
            })
        })  
    }
    // Ajoute un utilisateur (register)
    addLogin(email, password){
        return new Promise((resolve, reject)=>{
            this.db.query('INSERT INTO authentification(email, password) VALUES(?, ?)', [email, password], (err, result) =>{
                if (err)
                    resolve(this.error(err.message));
                else{
                    // Recherche ce nouveau membre dans la bdd pour récuppérer et envoyer son id
                    this.db.query('SELECT * FROM authentification WHERE email = ?', [email], (err, result) =>{
                        if (err)
                            resolve(this.error(err.message));
                        else
                            resolve(this.success(result));
                    })
                }
            })
        })
    }

    success(result) {
        return {
                status : "success",
                result : result
        }
    }
    error(message){
        return {
                status : "error",
                result : message
        }
    }
}