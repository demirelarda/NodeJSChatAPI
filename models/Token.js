const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  userChatID:{
    type: String,
    unique:true,
    required:true
  },
  tokenList: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model('Token', TokenSchema);