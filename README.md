Installation and Running

1.) Option 1: <code>git clone https://github.com/D3VON/react_starter_spa.git</code> <br>
    Option 2: If you have a zip file, unzip that and cd to that directory. There
    will be two sub-directiries in there  (database and sequence-store).
2.) In each directory (database and sequence-store)
    A.) run: <code>npm install</code> <br>
    B.) run: <code>npm start</code> <br>
    (NOTE: in the database directory there is a pseudo database server (it is a
    Node.js server), and it uses port 5959.)
3.) In your browser, go to <code>http://localhost:8888</code>


Tests

Attempts were made to test.  The developer was not able to implement any working
tests, however.  nodeunit was used, and non-working files have been included in
this project.

Technologies Used and Design Decisions Explained

- Servers were made with Node.js and the Express framework.
- Views were made using React.js
- Promise library Q was used to handle asynchronous requests to the database.
- validation of user input is in /sequence-store/src/lib/store_sequence.js
- alert()s were used to indicate to the user that a given sequence passed 
  validation, and was "saved" by the pseudo database.
- Some basic CSS has been provided for "niceness". 

In order to make the 'fake database' module seem like a real database, a
Node server was set up to handle the REST request(s).  In particular, since the
SPA attempts to do PUT requests, that verb was implemented in the fake
database server.

The developer recognizes that this decision went outside the expected design of
the assignment. Further, the developer believes it would have been easier to
set up an actual database, rather than to contend with the developers inability
to understand how the simple db.js file functions. See the some additional notes
about this in /sequence-store/src/lib/store_sequence.js
