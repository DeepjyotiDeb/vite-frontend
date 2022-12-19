import { Button, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { CustomAppBar } from '../../elements/CustomDrawer2';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  button: {
    outline: 'none',
    fontSize: 16,
  },
  appBar: {
    zIndex: 2,
  },
}));

export const Header = ({ currentUser }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CustomAppBar
        color='secondary'
        className={classes.appBar}
        position='fixed'
      >
        <Toolbar>
          <Link className='nav__option' to='/home'>
            <Typography variant='h4' color='inherit' noWrap>
              SmartPaper
            </Typography>
          </Link>
          {currentUser ? (
            <div className='nav__users'>
              <Button
                aria-controls='user-menu'
                aria-haspopup='true'
                className='nav__user'
                onClick={handleMenu}
              >
                {currentUser.name}
              </Button>
              <Menu
                id='user-menu'
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
              </Menu>
            </div>
          ) : (
            <div className='nav__users'>
              <div className='nav__user'>
                <Link className='nav__option' to='/login'>
                  <Button
                    variant='contained'
                    className={classes.button}
                    color='secondary'
                  >
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </Toolbar>
      </CustomAppBar>
    </div>
  );
};
