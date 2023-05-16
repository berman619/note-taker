const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');
const uuid = require('./helpers/uuid');
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received to get notes`);
    // use fs.readFile to read the db.json file
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Failed to get notes."
            });
        }
    // parse the data and send it back to the client
    const notes = JSON.parse(data);
    return res.json(notes);
    });
});

app.post('/api/notes', (req, res) => {
    //receive a new note to save on the request body
    const { noteTitle, noteText } = req.body;
    //read the db.json file 
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Failed to get notes."
            });
        }
    // parse the data and send it back to the client
    const notes = JSON.parse(data);
    // Add a unique ID to the new note
    const newNote = {
        noteTitle = title,
        noteText = text,
        review_id: uuid(),
      };
    // Add the new note to the array
    notes.push(newNote);
    // Convert the updated array back into a JSON string using JSON.stringify
      console.log(`Updated note list: ${JSON.stringify(newNoteList)}`);
    // use fs.writeFile to write the updated JSON string back to the db.json file
    fs.writeFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Failed to add note."
            });
        }
}

app.listen(PORT, () =>
  console.log(`Now listening at http://127.0.0.1:${PORT}`)
)