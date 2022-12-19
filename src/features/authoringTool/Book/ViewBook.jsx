/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Add, Assessment, MenuBook } from '@mui/icons-material';
import {
  ButtonBase,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { styled } from '@mui/styles';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { currentBook, setCurrentBook } from './BookSlice';
import useModal from './Hooks/useModal';
import { currentUser } from '../../auth/userSlice';
import { getBookDetailsApi } from '../../../api/authoringApi';
import AddPage from '../../../elements/AddPage';
import { CustomIconLabelButton } from '../../../elements/CustomButton';
const options = [
  {
    title: 'Smart Pages',
    route: 'resources',
    details: 'Manage Smart Pages',
    icon: <MenuBook fontSize='medium' />,
  },
  {
    title: 'Assessments',
    route: 'tests',
    details: 'Manage Assessments',
    icon: <Assessment fontSize='medium' />,
  },
];

const Img = styled('img')({
  margin: 'auto',
  display: 'block',
  maxWidth: '100%',
  maxHeight: '100%',
  cursor: 'auto',
  // borderRadius: '50%',
  // border: '1px solid #a6a4a4',
  // borderRadius: '8px',
});
export const ViewBook = () => {
  const navigate = useNavigate();
  const user = useSelector(currentUser);
  const book = useSelector(currentBook);
  // console.log(book);
  const dispatch = useDispatch();

  const [state, setState] = useState({
    author: [],
    token: '',
    book: null,
    downloadSuccess: false,
    downloadError: false,
  });
  const {
    isShowing,
    toggle,
    maxWidth,
    fullWidth,
    handleMaxWidthChange,
    handleFullWidthChange,
  } = useModal();
  const location = useLocation();
  const { id } = useParams();

  useEffect(() => {
    document.title = 'Authoring Tool | ViewBook ';
    // if (!('user' in localStorage || 'token' in localStorage)) {
    //   dispatch(setCurrentUser(null));
    //   navigate('/login');
    // }
    // if (book === null) {
    //   navigate('/authoring/books');
    // }
    // console.log('location', id, location);

    getBookDetailsFunction();
  }, [user]);

  const getBookDetailsFunction = async () => {
    await getBookDetailsApi(
      { bookId: id },
      { headers: { Authorization: user.token } }
    ).then((res) => {
      const { book } = res.data;
      dispatch(setCurrentBook(book));
      // console.log('res', res);
      setState((prevState) => ({
        ...prevState,
        author: user,
        book: book,
      }));
    });
  };

  const handleRoute = (prop) => {
    navigate(`${prop}`);
  };

  return (
    <>
      <Paper
        sx={{
          pl: 2,
          py: 2,
          pr: 0,
          mr: 0,
          margin: 'auto',
          minWidth: '500px',
          width: '100%',
          maxWidth: '100%',
          // textAlign: 'center',
          // maxWidth: 500,
          flexGrow: 1,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        }}
      >
        <Grid container>
          {!state.book && (
            <Grid
              item
              sx={{
                // border: '1px solid black',
                width: '100%',
                minHeight: '80vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CircularProgress />
            </Grid>
          )}
          {state.book && (
            <Grid item>
              <ButtonBase sx={{ width: 128, height: 128 }}>
                <Img alt='complex' src={state.book?.thumbnail} />
              </ButtonBase>
            </Grid>
          )}
          {state.book && (
            <Grid item xs={12} sm container>
              <Grid item xs container direction='column' spacing={2}>
                <Grid item xs>
                  <Typography gutterBottom variant='subtitle1' component='div'>
                    Book Name : {state.book?.bookName}
                  </Typography>
                  <Typography
                    variant='body2'
                    component='div'
                    gutterBottom
                    mt={3}
                  >
                    Book Type : {state.book?.bookType}
                  </Typography>
                  <Typography variant='body2' gutterBottom>
                    Publisher :{' '}
                    <span
                      style={{
                        textDecoration: 'underline',
                        display: 'inline',
                      }}
                    >
                      {state.book?.publisher}
                    </span>
                  </Typography>
                  <Typography variant='body2'>
                    Pages : {state.book?.totalPages}
                  </Typography>
                </Grid>
                {/* <Grid item>
                <Typography sx={{ cursor: 'pointer' }} variant='body2'>
                  Remove
                </Typography>
              </Grid> */}
              </Grid>
              <Grid item>
                <CustomIconLabelButton
                  onClick={toggle}
                  variant='contained'
                  // style={{ background: '#06224A' }}
                  // color='secondary'
                >
                  <Add />
                  <span style={{ marginTop: '8px' }}>Add Pages</span>
                </CustomIconLabelButton>
                {options.map(({ title, route, icon }, index) => (
                  <CustomIconLabelButton
                    aria-label='Smart Pages'
                    id={`title-${index}`}
                    key={index}
                    onClick={() => handleRoute(route)}
                  >
                    {icon}
                    <span style={{ marginTop: '8px' }}>{title}</span>
                  </CustomIconLabelButton>
                ))}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Paper>
      <AddPage
        isShowing={isShowing}
        hide={toggle}
        maxWidth={maxWidth}
        handleFullWidthChange={handleFullWidthChange}
        handleMaxWidthChange={handleMaxWidthChange}
        fullWidth={fullWidth}
        user={user}
        book={state.book}
        getBookDetailsFunction={getBookDetailsFunction}
      />
    </>
  );
};
