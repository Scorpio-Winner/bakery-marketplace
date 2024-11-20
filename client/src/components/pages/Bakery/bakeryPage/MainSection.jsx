import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import mainSection from "./img/mainSection.png";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundImage: `url(${mainSection})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    padding: theme.spacing(4),
    height: "100vh",
    
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent:"space-around",
  },
  title: {
    color: "#ffffff",
    marginBottom: theme.spacing(1),
  },
  infoContainer: {
    display: "flex",
    alignItems: "center",
  },
  infoIcon: {
    color: "#ffffff",
    marginRight: theme.spacing(1),
  },
  infoText: {
    color: "#ffffff",
    marginBottom: 0,
  },
  infoText2: {
    color: "#2E363E",
    marginBottom: 0,
  },
  sectionContent: {
    position: "absolute",
    left: "30%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    textAlign: "left",
    gap: theme.spacing(4),
  },
  yellowBox: {
    background: "#FED84C",
    padding: theme.spacing(1),
    marginBottom: theme.spacing(2),
    borderRadius:"0.2vw",
  },
}));

const MainSection = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    window.location.reload();
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };
  
  const handleBasketClick = () => {
    navigate("/basket");
  };

  const handleOrdersClick = () => {
    navigate("/orders");
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Typography variant="h4" className={classes.title}>
          Сладкий рай
        </Typography>
        <div className={classes.infoContainer}>
          <LocationOnIcon className={classes.infoIcon} />
          <Typography variant="body1" className={classes.infoText}>
            г. Могилев, ул. Ленина 52
          </Typography>
        </div>
        <div className={classes.infoContainer}>
          <PhoneIcon className={classes.infoIcon} />
          <Typography variant="body1" className={classes.infoText}>
            8 (0222) 524-36-85 <br></br>
            Ежедневно с 9:00 до 20:00
          </Typography>
        </div>
        <div>
          {/* Заказы */}
          <IconButton color="inherit" onClick={handleOrdersClick}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "2px solid #FFFFFF",
              }}
            >
              <InventoryIcon sx={{ fontSize: 24, color: "#FFFFFF" }} />
            </Box>
          </IconButton>

          {/* Корзина */}
          <IconButton color="inherit" onClick={handleBasketClick}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "2px solid #FFFFFF",
              }}
            >
              <ShoppingCartIcon sx={{ fontSize: 24, color: "#FFFFFF" }} />
            </Box>
          </IconButton>

          {/* Профиль */}
          <IconButton color="inherit" onClick={handleProfileClick}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "2px solid #FFFFFF",
              }}
            >
              <PersonIcon sx={{ fontSize: 24, color: "#FFFFFF" }} />
            </Box>
          </IconButton>

          {/* Кнопка выхода */}
          <IconButton color="inherit" onClick={handleLogoutClick}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "2px solid #FFFFFF",
              }}
            >
              <ExitToAppIcon sx={{ fontSize: 24, color: "#FFFFFF" }} />
            </Box>
          </IconButton>
        </div>
      </div>
      <div className={classes.sectionContent}>
        <Typography variant="h4" className={classes.title}>
          Пирожные и капкейки <br></br>от 8 р/шт. с доставкой по <br></br>Могилёву
        </Typography>
        <Typography variant="body1" className={classes.infoText}>
          Приготовим за 3 часа в день заказа.<br></br> Доставка на авто в холодильнике.
        </Typography>
        <div className={classes.yellowBox}>
          <Typography variant="body1" className={classes.infoText2}>
            9 различных видов на выбор
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default MainSection;