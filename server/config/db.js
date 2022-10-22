const mongoose = require("mongoose");

const InitiateMongoServer = async () => {
    try {
        await mongoose.connect('MongoDB connection link here', {
            useNewUrlParser: true
        });
        console.log("Connected to DB !");
    } catch (e) {
        console.log(e);
        throw e;
    }
};

module.exports = InitiateMongoServer;
