import {
  Box,
  Button,
  Divider,
  Typography,
  Card,
  Link,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import FormInput from "./FormInput";

const AuthForm = ({
  type,
  onSubmit,
  form,
  setForm,
  usernameError,
  usernameErrorMessage,
  passwordError,
  passwordErrorMessage,
  emailError,
  emailErrorMessage,
}) => {
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: `calc(100vh - 64px)`,
      }}
    >
      <Card
        variant="outlined"
        sx={{
          maxWidth: { xs: "320px", sm: "360px", md: "400px" },
          width: "100%",
          p: 3,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          component="h1"
          gutterBottom
          sx={{ mb: 2 }}
        >
          {type === "login" ? "SIGN IN" : "REGISTER"}
        </Typography>

        <Box
          component="form"
          onSubmit={onSubmit}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Form Fields */}
          <FormInput
            id="username"
            label="Username"
            value={form.username}
            onChange={handleChange}
            error={usernameError}
            helperText={usernameErrorMessage}
            placeholder="Enter your username"
            autoComplete="username"
          />
          {type === "register" && (
            <FormInput
              id="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={emailError}
              helperText={emailErrorMessage}
              placeholder="example@gmail.com"
              autoComplete="email"
            />
          )}
          <FormInput
            id="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={passwordError}
            helperText={passwordErrorMessage}
            placeholder="••••••"
            autoComplete="current-password"
          />

          {/* Remember me checkbox for login only */}
          {type === "login" && (
            <FormControlLabel
              control={
                <Checkbox
                  name="remember_me"
                  checked={form.remember_me}
                  onChange={handleChange}
                />
              }
              label="Remember me"
            />
          )}

          {/* Submit Button */}
          <Button type="submit" variant="contained" disableElevation fullWidth>
            {type === "login" ? "LOG IN" : "REGISTER"}
          </Button>

          <Divider>or</Divider>

          {/* Signup / Login Link */}
          <Typography variant="body2" align="center">
            {type === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <Link href="/register" variant="body2">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/signin" variant="body2">
                  Sign in
                </Link>
              </>
            )}
          </Typography>

          {/* Error Snackbar */}
          {/* <ErrorSnackbar error={error} setError={setError} /> */}
        </Box>
      </Card>
    </Box>
  );
};

export default AuthForm;
