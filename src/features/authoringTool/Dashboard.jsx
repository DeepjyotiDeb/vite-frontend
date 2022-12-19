/* eslint-disable react-hooks/exhaustive-deps */

import {
  Assessment,
  ChevronLeft,
  Logout,
  MenuBook,
  Stars,
  SubdirectoryArrowRight,
} from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  Collapse,
  CssBaseline,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import { makeStyles, useTheme } from '@mui/styles';
// import { useTheme } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { Breadcrumbs, BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  Link as RouterLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import AllTests from './AllTests/AllTests';
import { EditAruco } from './Aruco/EditAruco';
import AddBook from './Book/AddBook';
import { Books } from './Book/Books';
import { currentBook, setCurrentBook } from './Book/BookSlice';
import { EditBook } from './Book/EditBook';
import { ViewBook } from './Book/ViewBook';
import AddSkill from './Skills/AddSkill';
import { Skills } from './Skills/Skills';
import { Resources } from './SmartPages/Resources';
import AddTest from './Tests/AddTest';
import Tests from './Tests/Tests';
import ViewTest from './Tests/ViewTest';
import { setOrganization } from '../auth/organizationSlice';
import { currentUser, setCurrentUser } from '../auth/userSlice';
import { Profile } from '../../CommonComponent/Profile/Profile';
import CustomAvatar from '../../elements/CustomAvatar';
import { CustomDrawer, DrawerHeader } from '../../elements/CustomDrawer';

// const Resources = lazy(() => import('./SmartPages/Resources'));
// const ViewTest = lazy(() => import('./Tests/ViewTest'));
// const AddTest = lazy(() => import('./Tests/AddTest'));
// const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const LinkRouter = (props) => (
  <Link
    {...props}
    color='link.primary'
    underline='hover'
    mx={1}
    component={RouterLink}
  />
);
export const Dashboard = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [book, setBook] = useState('#757575');
  const [resource, setResource] = useState('#757575');
  const [skill, setSkill] = useState('#757575');
  // const [view, setView] = useState('#757575');
  const [tests, setTests] = useState('#757575');
  //   const history = useHistory();
  const location = useLocation();
  const navigate = useNavigate();
  // const { id, testId } = useParams();

  const user = useSelector(currentUser);
  const localBook = useSelector(currentBook);
  const dispatch = useDispatch();

  useEffect(() => {
    if (location.pathname === '/authoring/books') {
      setBook('#f50057');
      setSkill('#757575');
      setResource('#757575');
    } else if (
      location.pathname === '/authoring/skills' ||
      location.pathname === '/authoring/skills/add'
    ) {
      setBook('#757575');
      setSkill('#f50057');
      setResource('#757575');
    } else if (
      location.pathname === '/authoring/' ||
      location.pathname === '/authoring'
    ) {
      navigate('/authoring/books');
    } else {
      setBook('#757575');
      setSkill('#757575');
      setResource('#f50057');
    }
    // if (location.pathname === '/authoring/view') {
    //   setResource('#757575');
    //   setView('#f50057');
    // } else setView('#757575');
    if (location.pathname === '/authoring/tests') {
      setResource('#757575');
      setTests('#f50057');
    } else setTests('#757575');
    if (
      localBook &&
      location.pathname === `/authoring/books/${localBook._id}/resources/aruco`
    ) {
      setOpen(false);
    } else setOpen(true);
  }, [location.pathname]);

  const handleProfile = () => {
    navigate('profile');
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    dispatch(setCurrentUser(null));
    dispatch(setCurrentBook(null));
    dispatch(setOrganization(null));
    localStorage.clear();
    // history.push({
    //   pathname: '/login',
    // });
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <CustomDrawer
        variant='permanent'
        anchor='left'
        open={open}
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        {/* {console.log({ open })} */}
        <DrawerHeader>
          {!open && (
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={handleDrawerOpen}
              edge='start'
            >
              <MenuIcon />
            </IconButton>
          )}
          {open && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                flex: '1 1 auto',
                pr: 0,
              }}
            >
              <Typography
                variant='button'
                display='block'
                sx={{
                  flexShrink: 0,
                  textTransform: 'none',
                  px: 3,
                  justifyContent: 'center',
                }}
              >
                Smart Paper
              </Typography>
              <IconButton
                onClick={handleDrawerClose}
                sx={{ alignSelf: 'flex-end', ml: 'auto' }}
              >
                {theme.direction === 'ltr' && <ChevronLeft />}
              </IconButton>
            </div>
          )}
        </DrawerHeader>
        {/* <DrawerHeader>
          <IconButton
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            edge='start'
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}>
            <MenuIcon />
          </IconButton>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </DrawerHeader> */}
        <Divider />
        <List sx={{ marginTop: 0 }}>
          <ListItem
            disablePadding
            sx={{ display: 'block' }}
            onClick={() => {
              dispatch(setCurrentBook(null));
              //   console.log(currentBook);
              console.log('currentBook');
              navigate('/authoring/books');
            }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <MenuBook sx={{ color: book }} />
              </ListItemIcon>
              <ListItemText
                sx={{ color: book, opacity: open ? 1 : 0 }}
                primary={`Books`}
              >
                Books
              </ListItemText>
            </ListItemButton>
          </ListItem>
          <Collapse in={open} timeout='auto' unmountOnExit>
            {localBook && (
              <List component='div' disablePadding sx={{ display: 'block' }}>
                <ListItem
                  component={RouterLink}
                  className={classes.nested}
                  to={`books/${localBook._id}`}
                >
                  <ListItemButton>
                    <ListItemIcon
                      style={{ minWidth: '0px', marginRight: '0.25rem' }}
                    >
                      <SubdirectoryArrowRight style={{ color: resource }} />
                    </ListItemIcon>
                    <Tooltip title={localBook.bookName}>
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {localBook.bookName}
                          </Typography>
                        }
                        sx={{ color: resource, opacity: open ? 1 : 0 }}
                      />
                    </Tooltip>
                  </ListItemButton>
                </ListItem>
              </List>
            )}
          </Collapse>
          <ListItem
            onClick={() => {
              navigate('skills');
            }}
            disablePadding
            sx={{ display: 'block' }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Stars style={{ color: skill }} />
              </ListItemIcon>
              <ListItemText
                primary={`Skills`}
                sx={{ color: skill, opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
          {/* <ListItem
            onClick={() => {
              navigate('view');
            }}
            disablePadding
            sx={{ display: 'block' }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Image style={{ color: view }} />
              </ListItemIcon>
              <ListItemText
                primary={`View Image`}
                sx={{ opacity: open ? 1 : 0, color: view }}
              />
            </ListItemButton>
          </ListItem> */}
          <ListItem
            onClick={() => {
              navigate('tests');
            }}
            disablePadding
            sx={{ display: 'block' }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Assessment style={{ color: tests }} />
              </ListItemIcon>
              <ListItemText
                primary={`Tests`}
                sx={{ opacity: open ? 1 : 0, color: tests }}
              />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider sx={{ marginTop: 'auto' }} />
        <List>
          <ListItem
            onClick={handleProfile}
            // component={RouterLink}
            // to={`${match.url}/skills`}
            disablePadding
            sx={{ display: 'block' }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <CustomAvatar
                user={user}
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                  width: 30,
                  height: 30,
                }}
              />
              <ListItemText
                primary={`${user.username}`}
                // primary={`username`}
                sx={{ opacity: open ? 1 : 0 }}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: 'medium',
                  color: '#000',
                }}
              />
            </ListItemButton>
          </ListItem>
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
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Tooltip title='Sign Out' placement='bottom'>
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
                primary='Sign Out'
                sx={{
                  opacity: open ? 1 : 0,
                }}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#000',
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </CustomDrawer>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          px: 3,
          display: 'flex',
          flexDirection: 'column',
          // alignItems: 'center',
          // justifyContent: 'center',
          flex: '1 1 auto',
        }}
      >
        {/* note: Breadcrumbs will either be wrapped inside drawerHeader or before
        Switch */}
        <DrawerHeader style={{ marginRight: 'auto' }}>
          <Breadcrumbs
            separator={<> &gt;</>}
            item={LinkRouter}
            finalItem={'b'}
            finalProps={{
              style: {
                alignSelf: 'flex-start',
                marginLeft: 8,
                color: 'text.primary',
              },
            }}
          />
          {/* {location.pathname !== '/authoring/skills' &&
            location.pathname !== '/authoring/skills/add' &&
            location.pathname !== '/authoring/profile' &&
            location.pathname !== '/authoring/view' && ( */}
          {location.pathname.includes('/authoring/books') && (
            <BreadcrumbsItem to='/authoring/books'>Books</BreadcrumbsItem>
          )}
          {localBook && location.pathname.includes('/authoring/books') && (
            <BreadcrumbsItem to={`/authoring/books/${localBook._id}`}>
              {localBook.bookName}
            </BreadcrumbsItem>
          )}
          {location.pathname.includes('/authoring/skills') && (
            <BreadcrumbsItem to='/authoring/skills'>Skills</BreadcrumbsItem>
          )}
          {/* {location.pathname === `/authoring/view` && (
            <BreadcrumbsItem to={`/authoring/view`}>View Image</BreadcrumbsItem>
          )} */}
          {localBook &&
            location.pathname.includes(
              `/authoring/books/${localBook._id}/resources`
            ) && (
              <BreadcrumbsItem
                to={`/authoring/books/${localBook._id}/resources`}
              >
                Smart Pages
              </BreadcrumbsItem>
            )}
          {localBook &&
            // (location.pathname === `/authoring/books/${localBook._id}/tests` ||
            //   location.pathname ===
            //     `/authoring/books/${localBook._id}/tests/${testId}` ||
            //   location.pathname ===
            //     `/authoring/books/${localBook._id}/tests/add`) &&
            location.pathname.includes(
              `/authoring/books/${localBook._id}/tests`
            ) && (
              <BreadcrumbsItem to={`/authoring/books/${localBook._id}/tests`}>
                Tests
              </BreadcrumbsItem>
            )}
        </DrawerHeader>
        <Routes>
          <Route path='/' element={<Books />} />
          <Route path='books' element={<Books />} />
          <Route path='books/add' element={<AddBook />} />
          <Route path='books/:id' element={<ViewBook />} />
          <Route path='books/:id/edit' element={<EditBook />} />

          <Route path='books/:id/resources' element={<Resources />} />

          <Route
            path='books/:id/resources/:splitPageId'
            element={<EditAruco />}
          />

          <Route path='books/:id/tests' element={<Tests />} />
          <Route path='books/:id/tests/add' element={<AddTest />} />
          {/* <Route path='books/:id/tests/add' element={<AddTest1 />} /> */}
          <Route path='books/:id/tests/:testId' element={<ViewTest />} />

          <Route path='skills' element={<Skills />} />
          <Route path='skills/add' element={<AddSkill />} />

          {/* <Route path='view' element={<ViewImage />} /> */}

          <Route path='tests' element={<AllTests />} />

          <Route path='profile' element={<Profile />} />
        </Routes>
      </Box>
    </Box>
  );
};
