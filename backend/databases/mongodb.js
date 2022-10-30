const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()

const DBproperties ={
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

const {
    MONGO_HOSTNAME,
    MONGO_PORT,
    MONGO_DB
} = process.env;

const DbConn = {
    "url" : `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`
}


mongoose.connect(DbConn.url,DBproperties);
const checkDbConn = mongoose.connection;
checkDbConn.on("error", console.error.bind('Mongodb connection error' + DbConn.url))
checkDbConn.once("open", ()=>{
    console.log('Mongodb connection successful')
})
