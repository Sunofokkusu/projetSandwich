const bcrypt = require('bcrypt')
const  db  = require('../../conf/dbConnexion')


async function insertUser(mail, username, password) {
    try{
        const hash = await bcrypt.hash(password, bcrypt.genSaltSync(parseInt(process.env.SECRET_KEY)));
        console.log(hash);
        const user = await db('client').insert({
            nom_client: username,
            mail_client: mail,
            passwd : hash
        });
        return user;
    }catch(err){
        throw new Error(err);
    }
}

module.exports = {
    insertUser
}