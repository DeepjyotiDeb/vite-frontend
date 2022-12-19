import { AccountCircle, Home, Logout } from '@mui/icons-material';
import GroupsIcon from '@mui/icons-material/Groups';
import {
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { setCurrentUser } from '../../auth/userSlice';
import { setCurrentBook } from '../../authoringTool/Book/BookSlice';

const drawerWidth = 240;

export default function Sidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let location = useLocation();
  let urlKey = location.pathname.slice(12);
  // const user = useSelector(currentUser);

  const handleRoute = (index) => {
    index === 0
      ? navigate(`/smartpaper/home`)
      : index === 1
      ? navigate(`/smartpaper/classes`)
      : navigate('/smartpaper/profile');
  };

  const handleLogout = () => {
    dispatch(setCurrentUser(null));
    dispatch(setCurrentBook(null));
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          display: 'flex',
          width: { xs: '12rem', md: drawerWidth },
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: { xs: '12rem', md: drawerWidth },
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
          <Typography
            sx={{
              color: 'text.secondary',
              cursor: 'pointer',
              fontSize: { xs: '1rem', md: '1.25rem' },
            }}
            onClick={() => handleRoute(0)}
          >
            My SmartPaper
          </Typography>
        </Toolbar>
        <Divider />
        <List
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          <Box>
            {[
              { key: 'home', value: t('home') },
              { key: 'classes', value: t('classes') },
              { key: 'profile', value: t('profile') },
            ].map((text, index) => (
              <ListItem
                key={text.value}
                disablePadding
                sx={
                  urlKey.includes(text.key) &&
                  { backgroundColor: 'Gainsboro' }
                }
              >
                <ListItemButton onClick={() => handleRoute(index)}>
                  <ListItemIcon>
                    {index === 0 ? (
                      <Home />
                    ) : index === 1 ? (
                      <GroupsIcon />
                    ) : (
                      <AccountCircle />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={text.value}
                    primaryTypographyProps={{
                      fontSize: { xs: '0.75rem', md: '1rem' },
                      letterSpacing: 0,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </Box>
          <Box>
            <Divider sx={{ marginTop: 'auto' }} />
            {/* <List> */}
            {/* <ListItem
              // onClick={handleProfile}
              // component={RouterLink}
              // to={`${match.url}/skills`}
              disablePadding
              sx={{ display: 'block' }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: 'center',
                  px: 2.5,
                }}
              >
                <CustomAvatar
                  user={'currentUser'}
                  url='https://lh3.googleusercontent.com/ogw/ADGmqu8IRt2zAKQDEDvqL5Egm51VKCxJm2eb-N8YELr3=s192-c-mo'
                  sx={{
                    minWidth: 0,
                    justifyContent: 'center',
                    width: 24,
                    height: 24,
                    mr: 1,
                  }}
                />
                <ListItemText
                  primary={`${user.mobile}`}
                  // primary={`username`}
                  // sx={{ opacity: open ? 1 : 0 }}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: 'medium',
                    color: '#000',
                  }}
                />
              </ListItemButton>
            </ListItem> */}
            <ListItem
              disablePadding
              sx={{ display: 'block' }}
              onClick={handleLogout}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 1,
                    justifyContent: 'center',
                  }}
                >
                  <Tooltip title="Sign Out" placement="bottom">
                    <Logout
                      sx={{
                        transform: 'rotate(180deg)',
                        width: 24,
                        height: 24,
                      }}
                    />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText
                  primary={t('logout')}
                  sx={{
                    opacity: 1,
                  }}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: '#000',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </Box>
        </List>
        {/* </List> */}
      </Drawer>
    </Box>
  );
}
