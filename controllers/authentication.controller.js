//
// Authentication controller
//
const ApiError = require('../model/ApiError')
const assert = require('assert')
const auth = require('../util/auth/authentication')

module.exports = {

    /**
     * Authenticate the incoming request by validating the JWT token. 
     * 
     * @param {*} req The incoming request, should contain valid JWT token in headers.
     * @param {*} res None. The request is passed on for further processing.
     * @param {*} next ApiError when token is invalid, or req containing logged-in user.
     */
    validateToken(req, res, next) {
        console.log("VALIDATE TOKEN")

        const token = (req.header('X-Access-Token')) || '';

        auth.decodeToken(token, (err, payload) => {
            if (err) {
                console.log('Error handler: ' + err.message);
                const error = new ApiError(err.message, 401)
                next(error)
            } else {
                conslole.log('authenticated, payload = ')
                console.dir(payload)
                console.log('ADD USER TO REQ HERE!')
                next();
            }
        });
    },

    /**
     * Log a user in by validating the email and password in the request.
     * Email is supposed to be more unique than a username, so we use that for identification.
     * When the email/password combination is valid a token is returned to the client. 
     * The token provides access to the protected endpoints in subsequent requests, as long 
     * as it is valid and not expired.
     * 
     * Security issue: the password is probably typed-in by the client and sent as 
     * plain text. Anyone listening on the network could read the password. The 
     * connection should therefore be secured and encrypted.
     * 
     * @param {*} req The incoming request, should contain valid JWT token in headers.
     * @param {*} res The token, additional user information, and status 200 when valid.
     * @param {*} next ApiError when token is invalid.
     */
    login(req, res, next) {

        // Verify that we receive the expected input
        try {
            assert(typeof (req.body.email) === 'string', 'email must be a string.')
            assert(typeof (req.body.password) === 'string', 'password must be a string.')
        }
        catch (ex) {
            const error = new ApiError(ex.toString(), 422)
            next(error)
            return
        }

        const validated = true

        // Verify that the email exists and that the password matches the email.
        if (validated) {
            // Generate JWT
            const token = { 
                token: auth.encodeToken(req.body.email), 
                email: req.body.email 
            }
            res.status(200).json(token).end();
        } else {
            next(new ApiError('Invalid credentials, bye.', 401))
        }
    },
    
    /**
     * Authenticate the incoming request by validating the JWT token. 
     * 
     * @param {*} req The incoming request, should contain valid JWT token in headers.
     * @param {*} res None. The request is passed on for further processing.
     * @param {*} next ApiError when token is invalid, or req containing logged-in user.
     */
    register(req, res, next) {

    }

}
