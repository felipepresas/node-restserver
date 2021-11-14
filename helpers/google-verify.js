const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function googleVerify(idToken = '') {

    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID, 
    });

    const { name: nombre,
        picture: img,
        email: correo
    } = ticket.getPayload();

    // console.log(payload);
    return {
        nombre,
        img,
        correo
    };
   

    // If request specified a G Suite domain:
    // const domain = payload['hd'];
}

module.exports = {
    googleVerify
}