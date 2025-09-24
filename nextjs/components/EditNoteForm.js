// // components/EditNoteForm.js
// "use client";

// import React, { useState } from "react";
// import {
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Button,
//   TextField,
// } from "@mui/material";

// export default function EditNoteForm({ note, open, onClose, onSubmit }) {
//   const [value, setValue] = useState(note ?? "");

//   const handleChange = (e) => {
//     setValue(e.target.value);
//   };

//   const handleUpdate = (e) => {
//     e.preventDefault();
//     onSubmit(value);
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       fullWidth
//       maxWidth="sm"
//       aria-labelledby="edit-note-dialog-title"
//     >
//       <DialogTitle id="edit-note-dialog-title" sx={{ pt: 3, pb: 2 }}>
//         Edit Note
//       </DialogTitle>

//       <DialogContent dividers>
//         <form id="edit-note-form" onSubmit={handleUpdate}>
//           <TextField
//             label="Note"
//             name="note"
//             fullWidth
//             variant="outlined"
//             value={value}
//             onChange={handleChange}
//             multiline
//             minRows={3}
//             autoFocus
//           />
//         </form>
//       </DialogContent>

//       <DialogActions sx={{ justifyContent: "flex-end", pt: 2, pb: 3, px: 3 }}>
//         <Button
//           variant="outlined"
//           color="error"
//           onClick={onClose}
//           sx={{ width: 100 }}
//         >
//           Cancel
//         </Button>
//         <Button
//           variant="contained"
//           color="primary"
//           sx={{ width: 100 }}
//           type="submit"
//           form="edit-note-form"
//         >
//           Update
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// components/EditNoteForm.js
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";

export default function EditNoteForm({ note, open, onClose, onSubmit }) {
  const [value, setValue] = useState("");

  // Sync with parent prop when it changes
  useEffect(() => {
    if (open) {
      setValue(note !== "No note available" ? note : ""); // don't populate placeholder
    }
  }, [note, open]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    onSubmit(value);
    onClose(); // close dialog after save
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="edit-note-dialog-title"
    >
      <DialogTitle id="edit-note-dialog-title" sx={{ pt: 3, pb: 2 }}>
        Edit Note
      </DialogTitle>

      <DialogContent dividers>
        <form id="edit-note-form" onSubmit={handleUpdate}>
          <TextField
            label="Note"
            name="note"
            fullWidth
            variant="outlined"
            value={value}
            onChange={handleChange}
            multiline
            minRows={3}
            autoFocus
          />
        </form>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end", pt: 2, pb: 3, px: 3 }}>
        <Button
          variant="outlined"
          color="error"
          onClick={onClose}
          sx={{ width: 100 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ width: 100 }}
          type="submit"
          form="edit-note-form"
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
