import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";

export default function Prayer({ name, time, src }) {
  return (
    <Card sx={{ minWidth:'240px',maxWidth: "350px", marginTop: "10px" }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={src}
          alt="green iguana"
        />
        <CardContent>
          <h1>{name}</h1>
          <h3 style={{color:'#88aec1'}}>
            {time}
          </h3>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
