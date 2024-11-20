import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import backgroundImage from './img/footerback.png';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '60vh',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
  },
  text: {
    color: '#7E868E',
    fontSize: '14px',
    textAlign: 'center',
  },
});

const Footer = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <p className={classes.text}>&copy; sweetchest.ru, 2023 | Sweet Chest | instagram.com/sweetchest</p>
    </div>
  );
};

export default Footer;