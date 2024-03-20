const db = require("../db");

// Get notes by transaction id
const getNotesByTransaction = async (transactionId) => {
  try {
    const notes = await db("note").where({ transaction_id: transactionId });
    const result = [];
    notes.forEach((note) => {
      result.push({
        id: note.id,
        transactionId: note.transaction_id,
        userId: note.user_id,
        content: note.content,
      });
    });
    return result;
  } catch (error) {
    console.log("Error getting notes by transaction:", error);
    return false;
  }
};

// Create a note by transaction
const createNote = async (data) => {
  try {
    const note = {
      transaction_id: data.transactionId,
      content: data.content,
    };
    await db("note").insert(note);
    return true;
  } catch (error) {
    console.log("Error creating note:", error);
    return false;
  }
};

module.exports = {
  getNotesByTransaction,
  createNote,
};
