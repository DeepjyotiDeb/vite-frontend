import {
  Analytics,
  Assessment,
  Book,
  Business,
  Create,
  Grading,
  Logout,
  School,
} from '@mui/icons-material';
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
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { setOrganization } from '../auth/organizationSlice';
import { setCurrentUser } from '../auth/userSlice';
import { setCurrentBook } from '../authoringTool/Book/BookSlice';

// import { setCurrentUser } from '../../auth/userSlice';
// import { setCurrentBook } from '../../authoringTool/Book/BookSlice';

const drawerWidth = 240;

export default function Sidebar() {
  const navigate = useNavigate();
  let location = useLocation();
  let urlKey = location.pathname.slice(7);
  const dispatch = useDispatch();
  // const user = useSelector(currentUser);

  const handleRoute = (index) => {
    index === 0
      ? navigate(`/admin`)
      : index === 1
      ? navigate(`/admin/authors`)
      : index === 2
      ? navigate(`/admin/teachers`)
      : index === 3
      ? navigate('/admin/books')
      : index === 4
      ? navigate('/admin/tests')
      : index===5
      ? navigate('/admin/results')
      : navigate(`/admin/usage`);
  };

  const handleLogout = () => {
    dispatch(setCurrentUser(null));
    dispatch(setCurrentBook(null));
    dispatch(setOrganization(null));
    localStorage.clear();
    window.location.reload(false);
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
            Smart Paper Admin
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
              { value: 'My Organization', key: '' },
              { value: 'Authors', key: 'authors' },
              { value: 'Teachers', key: 'teachers' },
              { value: 'Books', key: 'books' },
              { value: 'Tests', key: 'tests' },
              { value: 'Results', key: 'results' },
              { value: 'Usage', key: 'usage' },
            ].map((text, index) => (
              <ListItem
                key={text.key}
                disablePadding
                sx={
                  (urlKey === '' &&
                    text.key === '' && { backgroundColor: 'Gainsboro' }) ||
                  (urlKey.includes(text.key) &&
                    text.key !== '' && { backgroundColor: 'Gainsboro' })
                }
              >
                <ListItemButton onClick={() => handleRoute(index)}>
                  <ListItemIcon>
                    {index === 0 ? (
                      <Business />
                    ) : index === 1 ? (
                      <Create />
                    ) : index === 2 ? (
                      <School />
                    ) : index === 3 ? (
                      <Book />
                    ) : index === 4 ? (
                      <Assessment />
                    ) : index === 5 ? (
                      <Grading />
                    ) : (
                      <Analytics />
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
                  primary="Log Out"
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
