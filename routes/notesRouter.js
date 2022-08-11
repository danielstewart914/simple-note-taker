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

    // if note has a title and text  save it to the db
    if ( title && text ) {

        const newNote = {
            title,
            text,
            id: uuidv4()
        }

        db.push( newNote );

        fs.writeFile( './db/db.json', JSON.stringify( db, null, 4 ), error => 
            error ? console.error( error ) : console.log( '+ Note added.' ) );

        const response = {
            status: 'success',
            body: newNote
        };

        res.json( response );

    } else {
        res.status( 400 ).json( 'Missing note title or text' );
    }

} );

notesRouter.delete( '/:id', ( req, res ) => {
    
    const id = req.params.id;

    const index = db.map( element => element.id ).indexOf( id );

    if ( index >= 0 ) {
        db.splice( index, 1 );

        fs.writeFile( './db/db.json', JSON.stringify( db, null, 4 ), error => 
            error ? console.error( error ) : console.log( '- Note deleted.' ) );

        res.json( 'Note Deleted Successfully!' );
    } else {
        res.status( 400 ).json( 'Note does not exist' );
    }
} );

module.exports = notesRouter;