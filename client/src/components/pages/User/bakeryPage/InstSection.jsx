import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@mui/material";

import instagramPhoto1 from "./img/1.png";
import instagramPhoto2 from "./img/2.png";
import instagramPhoto3 from "./img/3.png";
import instagramPhoto4 from "./img/4.png";
import instagramPhoto5 from "./img/5.png";
import instagramPhoto6 from "./img/6.png";
import instagramPhoto7 from "./img/7.png";
import instagramPhoto8 from "./img/8.png";
import instagramPhoto9 from "./img/9.png";

const useStyles = makeStyles((theme) => ({
  section: {
    textAlign: "center",
    padding: theme.spacing(6),
  },
  title: {
    padding: theme.spacing(2),
  },
  subtitle: {
    padding: theme.spacing(2),
  },
  photoGrid: {
    marginTop: theme.spacing(4),
  },
  photoItem: {
    width: "33.333%",
    padding: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      width: "50%",
    },
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  photo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
}));

const InstSection = () => {
  const classes = useStyles();

  return (
    <section className={classes.section}>
      <Typography variant="h4" className={classes.title}>
        Сделали более 3.000 заказов за 2 года
      </Typography>
      <Typography variant="h6" className={classes.subtitle}>
        Посмотрите фото реальных заказов из нашего Instagram
      </Typography>
      <Grid container spacing={1} className={classes.photoGrid}>
        <Grid item xs={12} sm={6} md={4} className={classes.photoItem}>
          <img src={instagramPhoto1} alt="Instagram Photo" className={classes.photo} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} className={classes.photoItem}>
          <img src={instagramPhoto2} alt="Instagram Photo" className={classes.photo} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} className={classes.photoItem}>
          <img src={instagramPhoto3} alt="Instagram Photo" className={classes.photo} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} className={classes.photoItem}>
          <img src={instagramPhoto4} alt="Instagram Photo" className={classes.photo} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} className={classes.photoItem}>
          <img src={instagramPhoto5} alt="Instagram Photo" className={classes.photo} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} className={classes.photoItem}>
          <img src={instagramPhoto6} alt="Instagram Photo" className={classes.photo} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} className={classes.photoItem}>
          <img src={instagramPhoto7} alt="Instagram Photo" className={classes.photo} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} className={classes.photoItem}>
          <img src={instagramPhoto8} alt="Instagram Photo" className={classes.photo} />
        </Grid>
        <Grid item xs={12} sm={6} md={4} className={classes.photoItem}>
          <img src={instagramPhoto9} alt="Instagram Photo" className={classes.photo} />
        </Grid>
      </Grid>
    </section>
  );
};

export default InstSection;