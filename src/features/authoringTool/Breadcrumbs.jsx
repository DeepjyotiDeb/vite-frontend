// /* eslint-disable react-hooks/exhaustive-deps */
// import { NavigateNext } from '@mui/icons-material';
// import { Breadcrumbs, Link, Typography } from '@mui/material';
// import React, { useEffect } from 'react';
// import { Link as RouterLink, useLocation } from 'react-router-dom';

// import { currentBook } from './Book/BookSlice';

// // todo: Implement HASHMAP

// // const breadcrumbNameMap = new Map();
// // breadcrumbNameMap.set('/author', 'Author');
// // breadcrumbNameMap.set('/author/books', 'Books');
// // breadcrumbNameMap.set('/author/books/skills', 'Skills');

// /* function ListItemLink(props) {
//   const { to, open, ...other } = props;
//   const primary = breadcrumbNameMap[to];

//   let icon = null;
//   if (open != null) {
//     icon = open ? <ExpandLess /> : <ExpandMore />;
//   }

//   return (
//     <li>
//       <ListItem button component={RouterLink} to={to} {...other}>
//         <ListItemText primary={primary} />
//         {icon}
//       </ListItem>
//     </li>
//   );
// } */

// const LinkRouter = (props) => <Link {...props} component={RouterLink} />;

// const CustomBreadcrumbs = () => {
//   const breadcrumbNameMap = new Map();
//   const location = useLocation();
//   const pathnames = location.pathname.split('/').filter((x) => x);
//   const defaultRoutes = [
//     'home',
//     'author',
//     'books',
//     'skills',
//     'myProfile',
//     'resources',
//     'tests',
//     'options',
//     'addTest',
//     'editAruco',
//     'editBook',
//     'viewTest',
//   ];
//   const bookId = pathnames.filter((x) => !defaultRoutes.includes(x))[0];
//   console.log('bookId', bookId);
//   useEffect(() => {
//     if (
//       location.pathname === '/authoring/books' ||
//       location.pathname === '/authoring'
//     ) {
//       breadcrumbNameMap.clear();
//       breadcrumbNameMap.set('/authoring/books', 'Books');
//     }
//     return () => {};
//   }, []);

//   return (
//     <Breadcrumbs
//       aria-label='breadcrumb'
//       separator={<NavigateNext color='text.primary' fontSize='small' />}
//       sx={{ alignSelf: 'flex-start', my: 3 }}
//     >
//       {pathnames.map((value, index) => {
//         const last = index === pathnames.length - 1;
//         const to = `/${pathnames.slice(0, index + 1).join('/')}`;
//         console.log('location', location);
//         // const bookName = currentBook?.bookName;
//         if (bookId && location.pathname === '/authoring/books/:bookId') {
//           breadcrumbNameMap.set(
//             '/authoring/books/*',
//             currentBook ? currentBook.bookName : null
//           );
//         } else {
//           const lastPath = location.pathname.split('/').pop();
//           breadcrumbNameMap.set(
//             location.pathname,
//             lastPath.charAt(0).toUpperCase() + lastPath.slice(1)
//           );
//         }

//         return last ? (
//           <Typography color='text.primary' key={to} sx={{ px: 1 }}>
//             {breadcrumbNameMap.get(to)}
//           </Typography>
//         ) : (
//           <LinkRouter
//             underline='hover'
//             color='inherit'
//             to={to}
//             key={to}
//             sx={{ px: 1 }}
//           >
//             {breadcrumbNameMap.get(to)}
//           </LinkRouter>
//         );
//       })}
//     </Breadcrumbs>
//   );
// };

// export default CustomBreadcrumbs;
