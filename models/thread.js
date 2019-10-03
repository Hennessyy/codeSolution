let mongoose = require('mongoose');

//Forum thread schema
let forumSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  body:{
    type:String,
    required: true
  }
});

let Forum = module.exports = mongoose.model('Forum', forumSchema);
