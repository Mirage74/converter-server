const mongoose = require('mongoose')
const beautifyUnique = require('mongoose-beautiful-unique-validation')
mongoose.plugin(beautifyUnique)
mongoose.set('useUnifiedTopology', true)

const userSchema = new mongoose.Schema({
  transName: String,
  amountEUR: Number
}, {
  timestamps: false
})


userSchema.statics.publicFields = ['id', 'transName', 'amountEUR']

module.exports = mongoose.model('eurTrans', userSchema)
