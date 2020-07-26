const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const DataBase = require('./database');

const db = new DataBase();
const router = express.Router();
const app = express();
const config = {
    // permet d'utiliser express-session et cors...
    origin: 'http://localhost:3000',
    credentials: true,
};

db.connect()
    .then(reponse => console.log(reponse))
    .catch(err => console.log(err))

app.use(cors(config));
app.use(session({
    secret: 'Roxell222',    // clé permettant de crypter les cookies
    saveUninitialized: true,
    resave: true,
    cookie: {
        httpOnly: true,
        secure: false,  // true = nécessite des connexions HTTPS
        sameSite: false, // true bloque les requêtes CORS sur les cookies.
        maxAge: null    // ou Time is in miliseconds
    }
}));
app.use(bodyParser.json());       
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views'));

let sess; // global session

const cryptPassword = function(password, callback) {
    bcrypt.genSalt(12, function(err, salt) {
     if (err) 
       return callback(err);
 
     bcrypt.hash(password, salt, function(err, hash) {
       return callback(err, hash);
     });
   });
};
 
const comparePassword = function(plainPass, hashword, callback) {
    bcrypt.compare(plainPass, hashword, function(err, isPasswordMatch) {   
        return err == null ?
            callback(null, isPasswordMatch) :
            callback(err);
    });
};

router.post('/login',(req,res) => {
    // route post quand on clique sur le bouton login
    // vérifie si tous les champs sont rempli
    if(!req.body.password || !req.body.email)
        res.end("Veuillez indiquer une adresse email ainsi qu'un mot de passe");
    else{
        // vérifie les données de connection
        db.searchByMail(req.body.email).then(
            reponse =>{
                if(reponse.result == 'No Found !')
                    res.end("votre adresse mail n'a pas été trouvé...");
                else{
                    const user = reponse.result[0];
                    // vérifie le mot de passe
                    comparePassword(req.body.password, user.password,(err, isMatch)=>{
                        if(err)
                            res.end(err.message);
                        if(isMatch){
                            // si c'est correct:
                            sess = req.session;
                            sess.email = req.body.email
                            res.end("done");
                        }else
                            res.end("mauvais Mot de passe !...");             
                    })
                }
            }
        )
    }   
});

router.post('/register', (req, res) =>{
    // route post quand on clique sur le bouton Enregistrer de la view registre.html
    // vérifie si tous les champs sont rempli
    if(!req.body.password || !req.body.email)
        res.end("Veuillez indiquer une adresse email ainsi qu'un mot de passe");
    else{
        // on crypte le mot de passe:
        cryptPassword(req.body.password,(err, hash)=>{
            if(err)
                res.end(err.message);
            // recherche si l'email à déjà été utilisé
            db.searchByMail(req.body.email).then(
                reponse => {
                    if(reponse.result != 'No Found !')
                        res.end("l'adresse email est déjà utilisée...");
                    else{
                        // enregistre dans la bdd
                        db.addLogin(req.body.email, hash).then(
                            reponse =>{
                                if(reponse.status == 'success'){
                                    sess = req.session;
                                    sess.email = req.body.email
                                    res.end("done");
                                }    
                                res.end("erreur...");
                            }
                        )
                    } 
                }
            );
        })
    } 
});

router.get('/admin',(req,res) => {
    // la route admin (quand on est identifié)
    sess = req.session;
    if(sess.email) {
        res.end(sess.email);
    }
    else {
        res.end('no');
    }
});

router.get('/logout',(req,res) => {
    // route pour se déconnecter
    req.session.destroy((err) => {
        if(err) 
            return console.log(err);
        res.end('vous vous êtes déconnecté');
    });
});

app.use('/', router);

app.listen(process.env.PORT || 8000,() => {
    console.log(`App Started on PORT ${process.env.PORT || 8000}`);
});