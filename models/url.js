const mongoose = require('mongoose');
const autoIncrementModelID = require('./counter');

let urlSchema = new mongoose.Schema({
    original_url : {
        type : String,
        required : true
    },
    id: { type: Number, unique: true, min: 1 }
});

urlSchema.pre('save', function (next) {
    if (!this.isNew) {
      next();
      return;
    }
  
    autoIncrementModelID('activities', this, next);
  });
  

module.exports = mongoose.model('urlCollection', urlSchema);