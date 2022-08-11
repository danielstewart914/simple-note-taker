const exp = require('constants');
const express = require( 'express' );
const path = require( 'path' );
const apiRouter = require( './routes' );

const PORT = process.env.PORT || 3001;

const app = express();

app.use( express.json() );
app.use( express.urlencoded( { extended: true } ) );

app.use( '/api', apiRouter );

app.use( express.static( 'public' ) );

// notes page
app.get( '/notes', ( req, res ) => {
    res.sendFile( path.join( __dirname, '/public/notes.html' ) );
} );

// default to index.html
app.get( '*', ( req, res ) => {
    res.sendFile( path.join( __dirname, '/public/index.html' ) );
} );

app.listen( PORT, () => {
    console.log( `App listening at http://localhost:${PORT}` );
} );