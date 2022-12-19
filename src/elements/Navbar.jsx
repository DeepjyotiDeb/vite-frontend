import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
// import { useRouter } from 'next/router';
// import { userStore } from '@/ZustandStore/ZustandStore';
// import NoSsr from './NoSsr';
import BookIcon from '@mui/icons-material/Book';
import LogoutIcon from '@mui/icons-material/Logout';
import { Button, Paper } from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useEffect,useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    // Link,
    useLocation,
    useNavigate,
  } from 'react-router-dom';

import { setCurrentUser } from '../features/auth/userSlice';
const drawerWidth = 240;
function BottomBar({location,handleRoute, handleLogout}){
  const [value, setValue] = useState(location.pathname==="/authoring/books"?0:1)
return(
  <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            newValue===0?handleRoute(0):newValue===1?handleRoute(1):handleLogout()
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Books" icon={<BookIcon />} />
          <BottomNavigationAction label="Skills" icon={<AutoAwesomeIcon />} />
          <BottomNavigationAction label="Sign Out" icon={<LogoutIcon />} />
        </BottomNavigation>
      </Paper>)
}

function Sidebar({location,handleRoute, handleLogout}) {


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
            width: { xs:'12rem', md:drawerWidth},
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: {xs:'12rem', md:drawerWidth},
            boxSizing: 'border-box',
          }
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{
          display:'flex',
          flexDirection:'column',
          justifyContent:'space-between',
          height:'100%',
        }}>
          <Box>
        <Toolbar>
          <Typography sx={{ color: 'text.secondary', cursor:'pointer', fontSize: {xs:'1rem', md:'1.25rem'} }} onClick={() => handleRoute(0)}>

            Authoring
          </Typography>
        </Toolbar>
        <Divider />
        <List>
        <ListItem  disablePadding>
              <ListItemButton selected = {location.pathname==="/authoring/books"} onClick={() => handleRoute(0)} >
                <ListItemIcon>

                    <BookIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Books"
                  primaryTypographyProps={{
                    fontSize: {xs:'0.75rem', md:'1rem'},
                    letterSpacing: 0
                  }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem  disablePadding>
              <ListItemButton onClick={() => handleRoute(1)}  selected = {location.pathname==="/authoring/skills"}

              >
                <ListItemIcon>

                  <AutoAwesomeIcon />

                </ListItemIcon>
                <ListItemText
                  primary="Skills"
                  primaryTypographyProps={{
                    fontSize: {xs:'0.75rem', md:'1rem'},
                    letterSpacing: 0
                  }}
                />
              </ListItemButton>
            </ListItem>

        </List></Box>
        <Box>
        <Divider />
        <Toolbar>

            <Button variant = "text" startIcon = {<LogoutIcon />} onClick={()=>{
              handleLogout()}}>Sign Out</Button>
        </Toolbar>
        </Box>
       </Box>
      </Drawer>
    </Box>
  );
}
export default function Navbar(){
  const [width, setWidth] = useState(0);
  const location=useLocation()
  const dispatch = useDispatch();
    const navigate = useNavigate()
  const handleRoute = index => {
    index === 0
      ? navigate(`/authoring/books`)
      :  navigate('/authoring/skills')

  };
  const handleLogout = () => {
    console.log("okay")
    dispatch(setCurrentUser({}));
    localStorage.clear();
    navigate('/login');
  };

  const handleWindowResize = () => {
    setWidth(window.innerWidth);
}
  useEffect(() => {
    setWidth(window.innerWidth)
    window.addEventListener('resize', handleWindowResize);
    return () => {
        window.removeEventListener('resize', handleWindowResize);
    }
}, []);
return(<>
  {width > 768? <Sidebar location={location} handleRoute={handleRoute} handleLogout={handleLogout}/>:<BottomBar location={location} handleRoute={handleRoute} handleLogout={handleLogout}/>}</>)
}
