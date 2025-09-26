// detail/[id]/BookImage.js
import { Card, CardMedia } from "@mui/material";

export default function BookImage({ apiUrl, image_path, title }) {
  const imageUrl = image_path?.startsWith("http")
    ? image_path
    : `${apiUrl}${image_path}`;

  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        borderRadius: 1,
        boxShadow: "none",
      }}
    >
      <CardMedia
        component="img"
        image={imageUrl}
        alt={title}
        sx={{
          width: "100%",
          height: "auto",
          objectFit: "cover",
          borderRadius: 1,
        }}
      />
    </Card>
  );
}
