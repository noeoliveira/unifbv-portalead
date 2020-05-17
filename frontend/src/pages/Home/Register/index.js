import React from 'react';
import { useDispatch } from 'react-redux';

import { TextField, Typography } from '@material-ui/core';
import { useFormik } from 'formik';

import { CustomButton } from '../../../components';
import Auth from '../../../services/firebase/Models/Auth';
import { setLoading, showMessage } from '../../../store/ducks/layout';
import * as i18n from '../../../utils/i18n_PTBR';
import { severityTypes } from '../../../utils/severityTypes';
import { initialValues, validationSchema } from '../helper';
import { useStyles } from './styles';

function SignUp() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    errors,
    touched,
    values,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      dispatch(setLoading(true));
      const data = await Auth.signUp(values);
      dispatch(setLoading(false));
      dispatch(
        showMessage({
          message: `Email ${data.user.toJSON().email} cadastrado`,
          time: 5000,
          type: severityTypes.SUCCESS,
        }),
      );
    },
  });

  const handleHelperTextEmail = () =>
    Boolean(errors.email) && touched.email ? errors.email : null;

  const handleHelperTextPassword = () =>
    Boolean(errors.password) && touched.password ? errors.password : null;

  const verifyButtonDisable = () =>
    !!(values.email === '' || values.password === '');

  return (
    <>
      <div className={classes.paper}>
        <Typography component="h1" variant="h3" className={classes.typography}>
          {`${i18n.signUpButtonText} no ${i18n.appNameText}`}
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label={i18n.emailText}
            name="email"
            autoComplete="email"
            onChange={handleChange}
            error={Boolean(errors.email) && touched.email}
            onBlur={handleBlur}
            helperText={handleHelperTextEmail()}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password"
            label={i18n.passwordText}
            name="password"
            autoComplete="current-password"
            type="password"
            onChange={handleChange}
            error={Boolean(errors.password) && touched.password}
            onBlur={handleBlur}
            helperText={handleHelperTextPassword()}
          />
          <div className={classes.containerBtnLoader}>
            <CustomButton
              type="submit"
              fullWidth
              disabled={verifyButtonDisable()}
              className={classes.submit}
            >
              {i18n.signUpButtonText}
            </CustomButton>
          </div>
        </form>
      </div>
    </>
  );
}

export default SignUp;
