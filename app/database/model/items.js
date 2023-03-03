const db = require("../../conf/dbConnexion");

async function getItems() {
    try {
        return await db("item").row("Distinct libelle, uri, tarif").select();
    } catch (error) {
        console.log(error);
        throw error;
    }
}


async function insertItems(idCommande, items = []) {
  try {
    let itemsToInsert = [];
    items.forEach((item) => {
      itemsToInsert.push({
        libelle: item.name,
        uri: item.uri,
        tarif: item.price,
        quantite: item.q,
        command_id: idCommande,
      });
    });
    return await db("item").insert(itemsToInsert);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
    getItems,
    insertItems
}