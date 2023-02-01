const db = require('../../conf/dbConnexion');

async function getOrders() {
    try {
        return await db('commande').select();   
    } catch (error) {
        throw error;
    }
}

async function  getOrderById(id) {
    try {
        return await db('commande').select().where('id', id);
    } catch (error) {
        throw error;
    }
}

async function updateOrder(id, nom, livraison, mail){
    try {
        return await db('commande').update({nom: nom, livraison: new Date(livraison), mail: mail,updated_at: new Date()}).where('id', id);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getOrders,
    getOrderById,
    updateOrder
}