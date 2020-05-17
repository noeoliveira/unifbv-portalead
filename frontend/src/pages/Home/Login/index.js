import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { TextField } from '@material-ui/core';
import { useFormik } from 'formik';

import { logoCircularGrande } from '../../../assets/img';
import { CustomButton } from '../../../components';
import Auth from '../../../services/firebase/Models/Auth';
import { setLoading } from '../../../store/ducks/layout';
import { initialValues, validationSchema } from '../helper';
import { useStyles } from './styles';

function Login() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const intl = useIntl();
  const email = intl.formatMessage({ id: 'emailText' });
  const password = intl.formatMessage({ id: 'passwordText' });
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
      try {
        await Auth.signIn(values);
      } catch (err) {
        console.log(err);
      }
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
        <img src={logoCircularGrande} className={classes.logo} alt="Logo" />
        <p />
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label={email}
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
            name="password"
            label={password}
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange}
            error={Boolean(errors.password) && touched.password}
            onBlur={handleBlur}
            helperText={handleHelperTextPassword()}
          />
          <CustomButton
            type="submit"
            fullWidth
            disabled={verifyButtonDisable()}
            className={classes.submit}
          >
            <FormattedMessage id="enterButtonText" />
          </CustomButton>
        </form>
      </div>
    </>
  );
}

export default Login;
