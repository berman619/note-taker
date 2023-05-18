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
    const { title, text } = req.body;
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
        title: title,
        text: text,
        id: uuid(),
      };
    // Add the new note to the array
    notes.push(newNote);
    // use fs.writeFile to write the updated JSON string back to the db.json file
    fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notes), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Failed to add note."
            });
        }
        res.json(newNote);
        });
    });
});

app.delete('/api/notes/:id', (req,res) => {
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
    const updatedNotes = notes.filter(note => note.id !== req.params.id);
    fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(updatedNotes), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                error: "Failed to delete note."
            });
        }
        res.status(204).end();
        });
    });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')));

app.listen(PORT, () =>
  console.log(`Now listening at http://127.0.0.1:${PORT}`)
)