const express = require('express');
const mongoose = require('mongoose');
const Note = require('./Model/Note');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.json());
app.get("/", (req, res) => {
    res.send("API is running..");
});
const PORT = process.env.PORT || 3000;


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
})

app.get("/getNotes", (req, res) => {
    Note.find(function (err, notes) {
        if (err) {
            console.log(err);
        } else {
            res.json(notes);
        }
    });
})

app.get("/getNote/:id", function (req, res) {
    let id = req.params.id;
    Note.findById(id, function (err, note) {
        if (err) {
            console.log(err);
        } else {
            res.json(note);
        }
    });
});

app.post("/addNotes", (req, res) => {
    let note = new Note(req.body);
    note.save()
        .then(note => {
            res.status(200).json({ 'note': 'note added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new note failed');
        });
})

app.put("/updateNote/:id", function (req, res) {
    Note.findById(req.params.id, function (err, note) {
        if (!note)
            res.status(404).send("data is not found");
        else {
            note.note_description = req.body.note_description;
            note.note_title = req.body.note_title;
        }

        note.save().then(note => {
            res.json('Note updated!');
        })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
})

app.delete("/deleteNote/:id", function (req, res) {
    Note.findByIdAndDelete(req.params.id, function (err, docs) {
        if (err) {
            console.log(err)
        }
        else {
            res.status(200).json({ 'note': 'note deleted successfully' });
        }
    });
})

app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});