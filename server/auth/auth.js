const jwt = require("jsonwebtoken");

module.exports = async (request, response, next) => {
    try {
        //   get the token from the authorization header
        const token = await request.headers.authorization.split(" ")[1];
        const data = await request.headers.authorization.split(" ")[2];

        //check if the token matches the supposed origin
        const decodedToken = await jwt.verify(token, "RANDOM-TOKEN");

        // retrieve the user details of the logged in user
        const user = await decodedToken;

        // If email token does not match jwt email
        // if (user.email !== data['email']) {
        //     throw false;
        // }

        // console.log(user)
        // console.log(data)

        // pass the user down to the endpoints here
        request.user = user;

        // pass down functionality to the endpoint
        next();

    } catch (error) {
        response.status(401).json({
            error: new Error("Invalid request!"),
        });
    }
};
