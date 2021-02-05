const mongoose = require('mongoose')

const { MONGO_USER, MONGO_PASS, MONGO_CLUSTER, MONGO_DB } = process.env

const mongoURL = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_CLUSTER}/${MONGO_DB}?retryWrites=true&w=majority`

mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
  })
  .then(() => console.log('mongo connected'))
  .catch((err) => console.log(err))
