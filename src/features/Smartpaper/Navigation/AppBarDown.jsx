import { AccountCircle, Group, Home } from '@mui/icons-material';
import { BottomNavigation, Paper, styled } from '@mui/material';
import MuiBottomNavigationAction from '@mui/material/BottomNavigationAction';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const BottomNavigationActionCustom = styled(MuiBottomNavigationAction)(`
  color: #ffffff;
  &.Mui-selected {
    color: #ffffff;
  }
  &.MuiBottomNavigationAction-label {
    font-size: 21px;
  }
`);

export const Navbar = () => {
  const [value, setValue] = useState(0);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleRoute = (index) => {
    index === 0
      ? navigate(`/smartpaper/home`)
      : index === 1
      ? navigate(`/smartpaper/classes`)
      : navigate(`/smartpaper/profile`)
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        color: '#ffffff',
        width: '100%',
        zIndex: 1000,
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        sx={{
          backgroundColor: '#003c96',
          // height: '50px'
          fontSize: '20px',
          zIndex: 1000,
        }}
      >
        {/* {[t('home'), t('library'), t('profile')].map((text, index) => ( */}
        {[t('home'), t('classes'), t('profile')].map((text, index) => (

          <BottomNavigationActionCustom
            key={index}
            label={text}
            onClick={() => handleRoute(index)}
            icon={
              index === 0 ? (
                <Home />
              ) 
              : index === 1 ? (
                <Group />
              ) 
                 :  (
                <AccountCircle />
              )

            }
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};
