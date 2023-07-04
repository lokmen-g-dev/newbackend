const mongoose = require("mongoose");
const opts = { toJSON: { virtuals: true } };

const addSchema = new mongoose.Schema({
  type: {
    type: String, // Changed the type to String for joining by name
    ref: "type",
  },
  titre: {
    type: String,
  },
  Description: {
    type: String,
  },
  fileData: {
    type: String,
  },
  status: {
    type: String,
    default: 'Encours'
  }
}, opts);

addSchema.virtual("joinedType", {
  ref: "type",
  localField: "type",
  foreignField: "type",
  justOne: true,
});

const reclamation = mongoose.model("reclamation", addSchema);
module.exports = reclamation;
