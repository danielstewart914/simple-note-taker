const express = require( 'express' );
const notesRouter = express.Router();
const { v4: uuidv4 } = require( 'uuid' );


notesRouter.get( '/', ( req, res ) => {
    // TODO db.json and send back response
    console.log('GET /notes request');
} );

module.exports = notesRouter;