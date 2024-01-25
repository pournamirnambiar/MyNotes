import "../App.css";
import axios from "axios";
import React, { useState, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import NoteCard from "./NoteCard";
import EditIcon from '@mui/icons-material/Edit';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NoteComponent() {
    const [note, setNote] = useState({
        note_title: "",
        note_description: ""
    });

    const [values, setvalues] = useState([]);
    const [editIndex, setEditIndex] = useState(-1);

    useEffect(() => {
        getAllNotes();
    }, [])

    const getAllNotes = () => {
        axios.get("/getNotes").then((response) => {
            setvalues(response.data);
        });
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNote((prevNote) => {
            return {
                ...prevNote,
                [name]: value
            };
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!note.note_title || !note.note_description) {
            toast.error("Please fill in the field");
            return;
        }

        if (editIndex === -1) {
            axios.post("/addNotes", {
                note_title: note.note_title,
                note_description: note.note_description
            })
                .then((response) => {
                    getAllNotes();
                });
        } else {
            // Updating an existing item

            axios.put(`/updateNote/${editIndex}`, {
                note_title: note.note_title,
                note_description: note.note_description
            })
                .then((response) => {
                    getAllNotes();
                });
            setEditIndex(-1);
        }

        setNote({
            note_title: "",
            note_description: ""
        });
    };

    const deleteNote = (id) => {
        axios.delete(`/deleteNote/${id}`)
            .then((response) => {
                getAllNotes();
            });
    };

    const EditNote = (id) => {
        setEditIndex(id);
        const note = values.find((item) => item._id === id);
        setNote({
            note_title: note.note_title,
            note_description: note.note_description
        });
    };

    return (
        <div className="main">
            <div>
                <form className="create-note" action="">
                    <input
                        name="note_title"
                        onChange={handleChange}
                        value={note.note_title}
                        placeholder="note_title"
                        type="text"
                    />
                    <textarea
                        name="note_description"
                        onChange={handleChange}
                        value={note.note_description}
                        placeholder="Take a note..."
                        rows={3}
                        type="text"
                    />

                    <button onClick={handleSubmit}>
                        {editIndex === -1 ? <AddIcon /> : <EditIcon />}
                    </button>
                </form>
            </div>

            {values &&
                values.map((item, index) => {
                    return (
                        <NoteCard
                            key={index}
                            id={item._id}
                            note_title={item.note_title}
                            note_description={item.note_description}
                            onDelete={deleteNote}
                            onEdit={EditNote}
                        />
                    );
                })}

            <ToastContainer autoClose={1000} />
        </div>
    );
}
