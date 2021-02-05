const mongoose = require('mongoose')

const attendanceSchema = mongoose.Schema({
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'childs',
    require: true
  },

  attend: Boolean,
  date: Date,
  updateOn: Date
})

module.exports = mongoose.model('attendances', attendanceSchema)
