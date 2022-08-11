const express = require( 'express' );
const notesRouter = express.Router();
const fs = require( 'fs' );
const { v4: uuidv4 } = require( 'uuid' );
const db = require( '../db/db.json' );


notesRouter.get( '/', ( req, res ) => {
    res.json( db );
} );

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
            if ( error ) {

                console.error( error );
                res.status( 500 ).json( 'Could not save note to file' );

            } else {

                console.log( '+ Note added.' );

                // create success response
                const response = {
                    status: 'success',
                    body: newNote
                };

                // return response
                res.json( response );
            }

        } );

    } else {
        // return error
        res.status( 400 ).json( 'Missing note title or text' );
    }

} );

notesRouter.delete( '/:id', ( req, res ) => {
    
    // get id from request
    const id = req.params.id;

    // find index of note with requested id
    const index = db.map( element => element.id ).indexOf( id );

    // if note was found
    if ( index >= 0 ) {

        // splice it out of the array
        db.splice( index, 1 );

        // write entire db array to file
        fs.writeFile( './db/db.json', JSON.stringify( db, null, 4 ), error => {
            if ( error ) {

                console.error( error );
                res.status( 500 ).json( 'Could not delete note from file' );

            } else {

                console.log( '- Note deleted.' );
                res.status( 200 ).json( 'Note Deleted Successfully!' );
            }

        } );
    
    } else {
        res.status( 400 ).json( 'Note does not exist' );
    }

} );

module.exports = notesRouter;