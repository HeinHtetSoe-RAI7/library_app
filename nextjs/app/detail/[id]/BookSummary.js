// detail/[id]/BookSummary.js
import { IconButton, Typography, Divider, Collapse } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";

export default function BookSummary({ book, summary, onEditClicked }) {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        {book.title}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {book.author}
        {book.year ? ` | ${book.year}` : ""}
      </Typography>
      <Divider variant="fullWidth" sx={{ my: 2 }} />

      <Collapse in={summary != ""} timeout="auto">
        <Typography variant="body1" mb={2}>
          {summary}
          {/* သီဟိုဠ်မှဉာဏ်ကြီးရှင်သည်အာယုဝဍ္ဎနဆေးညွှန်းစာကို
      //         ဇလွန်ဈေးဘေးဗာဒံပင်ထက်အဓိဋ္ဌာန်လျက်ဂဃနဏဖတ်ခဲ့သည်။ */}
        </Typography>
      </Collapse>
      <IconButton aria-label="edit-notes">
        <EditNoteIcon onClick={onEditClicked} />
      </IconButton>
    </>
  );
}
