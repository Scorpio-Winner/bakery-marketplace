import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@mui/material";

import backgroundPhoto from "./img/woman.png";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    maxHeight: "100vh",
  },
  rightSection: {
    padding: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {
      order: 1,
      width: "fit-content",
    },
  },
  leftSection: {
    [theme.breakpoints.down("sm")]: {
      order: 2,
      width: "100%",
    },
    backgroundImage: `url(${backgroundPhoto})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    height: "100vh",
    scale:"0.8",
    
    width: "fit-content",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    backgroundColor: "#F2F6FA",
    color: "#2E363E",
    marginBottom: theme.spacing(2),
    fontSize: "small",
    width: "fit-content",
    padding: theme.spacing(1),
  },
  titleH: {
    width: "fit-content",
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    width: "fit-content",
    marginBottom: theme.spacing(1),
    paddingLeft: 0, // Убираем отступ слева
    "&::before": {
      content: '""',
      backgroundColor: "purple",
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      marginRight: theme.spacing(1),
    },
  },
  list: {
    paddingLeft: 0, // Убираем отступ слева
    width: "fit-content",
    },
}));

const PastrychefSection = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} sm={6} md={4} lg={5} className={classes.rightSection}>
        <Typography variant="body2" className={classes.title}>
          Кто будет готовить?
        </Typography>
        <Typography variant="h3" className={classes.titleH}>
          Лично приготовлю <br></br>и всё красиво упакую <br></br>для вашего события.
        </Typography>
        <ul className={classes.list}>
          <li className={classes.listItem}>
            Проконсультирую по выбору капкейков и придумаю нестандартную идею
          </li>
          <li className={classes.listItem}>
            Приготовлю капкейки для вашего события, которые обязательно всем понравятся
          </li>
          <li className={classes.listItem}>
            Аккуратно и красиво всё упакую, если вы хотите сделать приятный подарок
          </li>
        </ul>
      </Grid>
      <Grid item xs={12} sm={6} md={8} lg={6} className={classes.leftSection}>
      </Grid>
    </Grid>
  );
};

export default PastrychefSection;