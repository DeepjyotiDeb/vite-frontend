import { Avatar } from '@mui/material';
import React from 'react';

function stringToColor(string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

const CustomAvatar = ({ user, url, ...props }) => {
  const { sx } = props;
  return (
    <>
      {user.username ? (
        <Avatar
          alt={`${user.username}`}
          src={url}
          // {...props}
          sx={{
            bgcolor: stringToColor(user.username),
            pl: 0.3,
            ...sx,
          }}
        >
          {user.username.charAt(0).toUpperCase()}
        </Avatar>
      ) : (
        <Avatar alt={`user name`} {...props} />
      )}
    </>
  );
};

export default CustomAvatar;
