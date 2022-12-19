import { Logout } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  AppBar,
  Button,
  Dialog,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepButton,
  Stepper,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { currentUser, setCurrentUser } from "../../auth/userSlice";
import { setCurrentBook } from "../../authoringTool/Book/BookSlice";
import { updateTeacherApi } from "../../../api/authApi";
import { getOrganizations } from "../../../api/organizationApi";
import CustomErrorTemplate from "../../../elements/CustomErrorTemplate";
import CustomSuccessTemplate from "../../../elements/CustomSuccessTemplate";

export const Onboarding = ({ user }) => {
  const [orgs, setOrgs] = useState([]);
  const { t } = useTranslation();
  const languages = [
    { id: 0, name: 'English' },
    { id: 1, name: 'हिन्दी' },
    // { id: 2, name: "Gujarati" },
    // { id: 3, name: "Bengali" },
    // { id: 4, name: "Punjabi" },
    // { id: 5, name: "Japanese" },
    // { id: 6, name: "Chinese" },
    // { id: 7, name: "German" },
    // { id: 8, name: "French" },
    // { id: 9, name: "Espanol" },
  ];
  const steps = [t("chooseLanguage"), t("selectOrg")];
  const [stepNum, setStepNum] = useState(0);
  const [orgName, setOrgName] = useState('')
  const [inputs, setInputs] = useState({
    organizationName: "",
    organizationId: "",
    language: "",
  });
  const [state, setState] = useState({
    name: "",
    email: "",
    organizationName: "",
    language: "",
    changedFields: [],
    user: null,
    userId: "",
    updateError: false,
    updateSuccess: false,
    updateErrorMessage: "",
    updateSuccessMessage: "",
    reload: false,
    loading: false,
  });
  const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    '& .MuiToggleButtonGroup-grouped': {
      margin: theme.spacing(0.5),
      border: 0,
      '&.Mui-disabled': {
        border: 0,
      },
      '&:not(:first-of-type)': {
        borderRadius: theme.shape.borderRadius,
      },
      '&:first-of-type': {
        borderRadius: theme.shape.borderRadius,
      },
    },
  }));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tempUserData = useSelector(currentUser);
  const handleNext = () => {
    setStepNum(stepNum + 1);
  };
  const handleLogout = () => {
    dispatch(setCurrentUser(null));
    dispatch(setCurrentBook(null));
    localStorage.clear();
    navigate("/login");
  };
  const handleSubmit = async () => {
    // console.log(state);
    console.log(inputs);
    setState({ ...state, loading: true });
    await updateTeacherApi(
      {
        userId: user._id,
        organizationId: inputs.organizationId,
        language: inputs.language,
      },
      {
        headers: {
          Authorization: user.token,
        },
      }
    )
      .then((res) => {
        const { user } = res.data;
        const { token } = tempUserData;
        dispatch(setCurrentUser({ ...user, token }));
        setState((prevState) => ({
          ...prevState,
          loading: false,
          user: user,
          name: user.name,
          email: user.email,
          organization: user.organization,
          language: user.language,
          userId: user._id,
          changedFields: [],
          updateSuccess: true,
          updateError: false,
          updateSuccessMessage: "Updated successfully",
        }));
        setTimeout(() => {
          setState((prevState) => ({
            ...prevState,
            updateSuccess: false,
            updateSuccessMessage: "",
          }));
        }, 4000);
      })
      .catch((err) => {
        console.log("err", err);
        console.log(state);
        setState((prevState) => ({
          ...prevState,
          loading: false,
          updateError: true,
          updateErrorMessage: err.response.data.message,
          name: state.name,
          organization: state.organizationName,
        }));
        setTimeout(() => {
          setState((prevState) => ({
            ...prevState,
            updateError: false,
            updateErrorMessage: "",
          }));
        }, 4000);
      });
  };
  const getAllOrgs = async () => {
    try {
      const result = await getOrganizations();
      console.log(result);
      setOrgs(result.data.organizations);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getAllOrgs();
  }, []);
  return (
    <Dialog
      fullScreen
      open={true}
      // onClose={handleClose}
      // TransitionComponent={Transition}
    >
      <AppBar sx={{ position: "relative", backgroundColor: "#0d47a1" }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {t("welcomeToSmartPaper")}
          </Typography>
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          pb: 10,
          pt: 10,
          height: "100%",
        }}
      >
        <Stepper activeStep={stepNum}>
          {steps.map((label, i) => (
            <Step key={label}>
              <StepButton color="inherit" onClick={() => setStepNum(i)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>
        {stepNum === 0 ? (
          <form onSubmit={handleNext} style={{ height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                pt: 10,
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <Typography variant='h3' mb='1rem'>{t('selectYourLanguage')}</Typography>

              <StyledToggleButtonGroup
                value={inputs.language}
                exclusive
                color='primary'
                sx={{ display: 'grid', gridTemplateColumns: 'auto auto auto' }}
                onChange={(e) => {
                  setInputs((inputs) => ({
                    ...inputs,
                    language: e.target.value,
                  }));
                }}
              >
                {' '}
                {languages.map((lang) => (
                  <ToggleButton
                    value={lang.name}
                    aria-label='list'
                    key={lang.id}
                    sx={{ width: '10rem' }}
                  >
                    {lang.name}
                  </ToggleButton>
                ))}
              </StyledToggleButtonGroup>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  margin: "0.5rem 0",
                }}
                sx={{ width: { xs: "80%", sm: "55%" } }}
              >
                <Button
                  disabled={inputs.language === ""}
                  variant="contained"
                  onClick={() => {
                    handleNext();
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleNext()}
                  style={{ margin: "0.5rem 0", width: "10rem" }}
                  type="submit"
                >
                  {t("next")}
                </Button>
              </Box>
            </Box>
          </form>
        ) : (
          // <form onSubmit={handleSubmit} style={{height:'100%'}}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              pt: 10,
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Typography variant="h3" mb='1rem'>{t("selectYourOrg")}</Typography>
            <FormControl sx={{ width: { xs: "80%", sm: "55%" } }}>
              {/* <Autocomplete
                name="organizationName"
                id="organizationName"
                disablePortal
                options={orgs}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  // console.log(newValue);
                  newValue === null
                    ? setInputs((inputs) => ({
                        ...inputs,
                        organizationName: "",
                        organizationId: "",
                      }))
                    : setInputs((inputs) => ({
                        ...inputs,
                        organizationName: newValue.name,
                        organizationId: newValue._id,
                      }));
                }}
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("organizations")}
                    fullWidth
                    margin="normal"
                  />
                )}
              /> */}
              <InputLabel id='demo-simple-select-label'>{t("organizations")}</InputLabel>
          <Select
            // value={inputs.organizationName}
            value={orgName || ''}
            label={t("organizations")}
            onChange={(event,newValue) => {
              console.log(event, newValue)
              setOrgName(event.target.value)
              setInputs((inputs) => ({
                ...inputs,
                organizationName: event.target.value,
                organizationId: newValue.props.obj._id,
              }));
              console.log(inputs)
            }}
          >
            {orgs.map((org) => (
              <MenuItem value={org.name} obj = {org} key={org._id}>
                {org.name}
              </MenuItem>
            ))}
          </Select>
            </FormControl>

            <Box
              style={{
                display: "flex",
                justifyContent: "flex-end",
                margin: "0.5rem 0",
              }}
              sx={{ width: { xs: "80%", sm: "55%" } }}
            >
              <LoadingButton
                disabled={inputs.organizationId === "" || state.loading}
                variant="contained"
                onClick={() => {
                  handleSubmit();
                }}
                loading={state.loading}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                style={{ margin: "0.5rem 0", width: "10rem" }}
                type="submit"
              >
                {t("submit")}
              </LoadingButton>
            </Box>
          </Box>
          // </form>
        )}

        <Box width="100%" sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            sx={{ width: { xs: "80%", sm: "55%" } }}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button variant="text" endIcon={<Logout />} onClick={handleLogout}>
              {t("logout")}
            </Button>
          </Box>
        </Box>
      </Container>
      {state.updateSuccess && (
        <CustomSuccessTemplate message={state.updateSuccessMessage} />
      )}
      {state.updateError && (
        <CustomErrorTemplate message={state.updateErrorMessage} />
      )}
    </Dialog>
  );
};
