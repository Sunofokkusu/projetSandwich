const db = require("../../conf/dbConnexion");

async function getOrders() {
  try {
    return await db("commande").select();
  } catch (error) {
    throw error;
  }
}

async function getOrderById(id) {
  try {
    return await db("commande").select().where("id", id);
  } catch (error) {
    throw error;
  }
}

async function updateOrder(id, nom, livraison, mail) {
  try {
    return await db("commande")
      .update({
        nom: nom,
        livraison: new Date(livraison),
        mail: mail,
        updated_at: new Date(),
      })
      .where("id", id);
  } catch (error) {
    throw error;
  }
}

async function getItemsFromOrder(id) {
  try {
    return await db("item").select().where("command_id", id);
  } catch (error) {
    throw error;
  }
}

async function insertOrder(id, client_name, client_mail, delivery, amount = 0) {
  try {
    return await db("commande").insert({
      id: id,
      nom: client_name,
      livraison: new Date(delivery.date + " " + delivery.time),
      mail: client_mail,
      montant: amount,
      created_at: new Date(),
      updated_at: new Date(),
    });
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getOrders,
  getOrderById,
  updateOrder,
  getItemsFromOrder,
  insertOrder,
};
