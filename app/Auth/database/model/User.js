const bcrypt = require('bcrypt')
const  db  = require('../../conf/dbConnexion')
const randToken = require('rand-token');


async function insertUser(mail, username, password) {
    try{
        const hash = await bcrypt.hash(password, bcrypt.genSaltSync(parseInt(process.env.SECRET_KEY)));
        console.log(hash);
        const user = await db('client').insert({
            nom_client: username,
            mail_client: mail,
            passwd : hash,
            refreshToken : randToken.uid(256),
            createdAt : new Date(),
            updatedAt : new Date()
        });
        return user;
    }catch(err){
        throw new Error(err);
    }
}

async function getUser(mail, password) {
    try{
        const user = await db('client').where({
            mail_client: mail
        }).first();
        if(!user) {
            return false;
        }
        const match = await bcrypt.compare(password, user.passwd);
        if(!match) {
            return false;
        }
        return user;
    }catch(err){
        throw new Error(err);
    }
}

module.exports = {
    insertUser,
    getUser
}