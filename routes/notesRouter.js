const express = require( 'express' );
const fs = require( 'fs' );
const { v4: uuidv4 } = require( 'uuid' );
const notesRouter = express.Router();
const db = require( '../db/db.json' );

// GET route
notesRouter.get( '/', ( req, res ) => {
    res.json( db );
} );

// POST route
notesRouter.post( '/', ( req, res ) => {
    // destructure note
    const { title, text }  = req.body;

    // if note has a title and text save it to the db
    if ( title && text ) {

        // create new note with unique id
        const newNote = {
            title,
            text,
            id: uuidv4()
        }

        // add new note to array
        db.push( newNote );

        // write entire db array to file
        fs.writeFile( './db/db.json', JSON.stringify( db, null, 4 ), error => {
            // if there is an error writing to file
            if ( error ) {

                console.error( error );
                // respond with an internal server error code
                res.status( 500 ).json( 'Could not save note to file' );

            } else {

                console.log( '+ Note added.' );

                // create success response
                const response = {
                    status: 200,
                    statusText: 'Success. Note has been added',
                    ok: true,
                    body: newNote
                };

                // return response
                res.json( response );
            }

        } );

    } else {
        // respond with a bad request error code
        res.status( 400 ).json( 'Cannot save note! Must have title and text properties' );
    }

} );

// DELETE route
notesRouter.delete( '/:id', ( req, res ) => {
    
    // get id from request
    const id = req.params.id;

    // find index of note with requested id
    const index = db.map( element => element.id ).indexOf( id );

    // if note index was found
    if ( index >= 0 ) {

        // splice it out of the array
        db.splice( index, 1 );

        // write entire db array to file
        fs.writeFile( './db/db.json', JSON.stringify( db, null, 4 ), error => {
            // if there is an error writing to file
            if ( error ) {

                console.error( error );
                // respond with an internal server error code
                res.status( 500 ).json( 'Could not delete note from file' );

            } else {

                console.log( '- Note deleted.' );

                // create success response
                const response = {
                    status: 200,
                    statusText: 'Success. Note has been deleted',
                    ok: true
                };

                res.json( response );
            }

        } );
    
    } else {
        // respond with a bad request error code
        res.status( 400 ).json( `Note with id: ${ id } does not exist` );
    }

} );

module.exports = notesRouter;