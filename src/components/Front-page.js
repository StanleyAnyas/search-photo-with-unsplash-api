import { React, useCallback, useState } from "react";
import "../App.css";
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import IconButton from'@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Stack } from '@mui/system';
import { Grid } from '@mui/material';
import axios from "axios";
import { Card } from '@mui/material';
import { CardContent } from '@mui/material';
import { CardMedia } from '@mui/material';
import { CardActions } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


export const FrontPage = () => { 
    const [searchValue, setSearchValue] = useState("");
    const [images, setImages] = useState([]);
    const accessKey = process.env.REACT_APP_ACCESS_KEY;
   
    const searchPhoto = useCallback(() => {
        axios.get(`https://api.unsplash.com/search/photos?per_page=24&client_id=${accessKey}&query=${searchValue}`)
        .then((response) => {
          const newImages = response.data.results.map((result) => ({
            id: result.id ? result.id : "No id",
            description: result.description ? result.description : "No description",
            nameOfPicture: result.alt_description ? result.alt_description : "No name of picture",
            name: result.user.name ? result.user.name : "No name",
            url: result.urls.regular ? result.urls.regular : `https://api.unsplash.com/photos/random`,
          }))
          setImages(newImages);
        })
        .catch((error) => {
          console.log(error);
        });
    }, [searchValue, accessKey]);
    const inputChanged = (event) => {
        setSearchValue(event.target.value);
      };

    const sharePhoto = (imageurl, description) => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${description}&url=${imageurl}`;
        window.open(twitterUrl, "_blank");
    }

    return (
        <div>

            <AppBar position="static" >
                <Toolbar>
                    <Typography variant="h6" alignItems={"center"}>
                        FIND ANY PHOTO
                    </Typography>
                </Toolbar>
            </AppBar>
            <Stack spacing={2} mt={10} direction="row" justifyContent="center" alignItems="center">
                <TextField type={Text} label="search photo" variant="outlined" name="search" onChange={inputChanged} onKeyDown={(event) => { 
                    if (event.keyCode === 13)
                        searchPhoto();
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={(event) => {
                                    event.preventDefault();
                                    setSearchValue("");
                                }}>
                                    x
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    />
                <Button variant="contained" onClick={searchPhoto}>Search</Button>
            </Stack>
            <br />
            <br />

            <Grid container spacing={{ xs: 4, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {images.map((image) => (
                    <Grid item xs={4} sm={4} md={4} key={image.id}>
                        <Card sx={{ maxWidth: 400, boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)" }}>
                            <CardMedia
                                component="img"
                                height="400"
                                image={image.url}
                                alt="Random"
                            />
                            <CardContent>
                                {<span style={{color: "red"}}>Name: <Typography variant="body2" sx={{ fontSize: 35, fontFamily: "@fontsource/roboto/400.css" }} color="text.secondary">
                                    {image.nameOfPicture}
                                </Typography> </span>}
                                <br/>
                                {<span style={{color: "red"}}>Photo description: <Typography variant="body2" sx={{fontSize: 20}} color="text.secondary">
                                    {image.description}
                                </Typography></span>}
                                <br/>
                                {<span style={{color: "red"}}>Photographer: <Typography variant="body2" sx={{ fontSize: 20}} color="text.secondary">
                                    {image.name}
                                </Typography></span>}
                            </CardContent>
                            <CardActions style={{display: "flex", justifyContent: "space-between"}}>
                                <Button className="share-icon" size="small" startIcon={<ShareIcon/>} onClick={sharePhoto}>Share</Button>
                                <Button className="download-icon" size="small" href={image.url} startIcon={<DownloadIcon/>}  target="_blank">Download</Button>
                            </CardActions>
                        </Card>
                        <br />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}
