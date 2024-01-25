import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
function NoteCard(props) {
    function handleClick() {
        props.onDelete(props.id);
    }
    function handleEdit() {
        props.onEdit(props.id);
    }
    return (
        <div className="note">
            <h1>{props.note_title}</h1>
            <p>{props.note_description}</p>
            <button onClick={handleClick}>
                <DeleteIcon />
            </button>
            <button onClick={handleEdit}>
                <EditIcon />
            </button>
        </div>
    );
}

export default NoteCard;
