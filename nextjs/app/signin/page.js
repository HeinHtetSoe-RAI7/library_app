// pages/signin.js
"use client";

import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { AuthContext } from "@/contexts/AuthContext";

import AuthForm from "@/components/AuthenticationForm/AuthForm";
import ErrorSnackbar from "@/components/ErrorSnackbar";

export default function SignIn() {
  const router = useRouter();

  const { login } = useContext(AuthContext);

  // Form state
  const [form, setForm] = useState({
    username: "",
    password: "",
    remember_me: false,
  });

  // Error states
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  // Form validation
  const validateInputs = () => {
    let isValid = true;

    // Username validation
    if (!form.username) {
      setUsernameError(true);
      setUsernameErrorMessage("Please enter your username.");
      isValid = false;
    } else {
      setUsernameError(false);
      setUsernameErrorMessage("");
    }

    // Password validation
    if (!form.password || form.password.length < 4) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 4 characters.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate the form inputs
    if (!validateInputs()) return;

    try {
      // Make API request for authentication
      const res = await api.post(
        "/signin",
        {
          username: form.username,
          password: form.password,
          remember_me: form.remember_me,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const token = res.data.access_token;
      const username = res.data.username;
      login({ token, username });
      router.push("/home");
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Invalid credentials or an unexpected error occurred.");
        console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
      }
    }
  };

  return (
    <>
      {/* Show Snackbar if there's an error */}
      <ErrorSnackbar error={error} setError={setError} />

      {/* AuthForm for the sign-in form */}
      <AuthForm
        type="login"
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        usernameError={usernameError}
        usernameErrorMessage={usernameErrorMessage}
        passwordError={passwordError}
        passwordErrorMessage={passwordErrorMessage}
        error={error}
        setError={setError}
      />
    </>
  );
}

// "use client";

// import React, { useState, useContext } from "react";
// import { useRouter } from "next/navigation";

// import api from "@/lib/axios";
// import { AuthContext } from "@/contexts/AuthContext";

// import {
//   Alert,
//   Box,
//   Button,
//   Checkbox,
//   FormControl,
//   FormControlLabel,
//   TextField,
//   Typography,
//   Card,
//   Link,
//   Divider,
//   Snackbar,
// } from "@mui/material";

// export default function Login() {
//   const router = useRouter();

//   // State variables for form inputs and errors
//   const [form, setForm] = useState({
//     username: "",
//     password: "",
//     remember_me: false,
//   });
//   const { login } = useContext(AuthContext);
//   const [error, setError] = useState("");
//   const [usernameError, setUsernameError] = useState(false);
//   const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
//   const [passwordError, setPasswordError] = useState(false);
//   const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

//   const handleChange = (e) => {
//     const { name, type, value, checked } = e.target;
//     setForm({
//       ...form,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const validateInputs = () => {
//     let isValid = true;

//     // Username validation
//     if (!form.username) {
//       setUsernameError(true);
//       setUsernameErrorMessage("Please enter your username.");
//       isValid = false;
//     } else {
//       setUsernameError(false);
//       setUsernameErrorMessage("");
//     }

//     // Password validation
//     if (!form.password || form.password.length < 3) {
//       setPasswordError(true);
//       setPasswordErrorMessage("Password must be at least 4 characters.");
//       isValid = false;
//     } else {
//       setPasswordError(false);
//       setPasswordErrorMessage("");
//     }

//     return isValid;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     // Validate the form inputs
//     if (!validateInputs()) return;

//     try {
//       // Make API request for authentication using the username and password
//       const res = await api.post(
//         "/signin",
//         {
//           username: form.username,
//           password: form.password,
//           remember_me: form.remember_me,
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true,
//         }
//       );

//       const token = res.data.access_token;
//       login(token);
//       router.push("/home"); // Redirect to the home page
//     } catch (err) {
//       if (err.response?.data?.detail) {
//         setError(err.response.data.detail);
//       } else {
//         setError("An unexpected error occurred. Please try again.");
//       }
//     }
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         height: `calc(100vh - 64px)`,
//       }}
//     >
//       <Card
//         variant="outlined"
//         sx={{
//           maxWidth: {
//             xs: "350px", // mobile
//             sm: "400px", // tablet
//             md: "450px", // laptop
//           },
//           width: "100%",
//           p: 3,
//           borderRadius: 2,
//         }}
//       >
//         {/* Form Title */}
//         <Typography
//           variant="h5"
//           align="center"
//           component="h1"
//           sx={{ mb: 2, fontWeight: "bold", fontFamily: "SansPro" }}
//           gutterBottom
//         >
//           SIGN IN
//         </Typography>

//         <Box
//           component="form"
//           onSubmit={handleSubmit}
//           noValidate
//           sx={{ display: "flex", flexDirection: "column", gap: 2 }}
//         >
//           {/* Username input */}
//           <FormControl fullWidth>
//             <TextField
//               id="username"
//               name="username"
//               label="Username"
//               required
//               placeholder="Enter your username"
//               value={form.username}
//               onChange={handleChange}
//               error={usernameError}
//               helperText={usernameErrorMessage}
//             />
//           </FormControl>

//           {/* Password input */}
//           <FormControl fullWidth>
//             <TextField
//               id="password"
//               name="password"
//               type="password"
//               label="Password"
//               required
//               placeholder="••••••"
//               value={form.password}
//               onChange={handleChange}
//               error={passwordError}
//               helperText={passwordErrorMessage}
//             />
//           </FormControl>

//           <Snackbar
//             open={Boolean(error)}
//             autoHideDuration={3000}
//             onClose={() => setError(null)}
//             anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//           >
//             <Alert
//               onClose={() => setError(null)}
//               severity="error"
//               sx={{ width: "100%" }}
//             >
//               {error}
//             </Alert>
//           </Snackbar>

//           {/* Remember me checkbox */}
//           <FormControlLabel
//             control={
//               <Checkbox
//                 name="remember_me"
//                 color="primary"
//                 checked={form.remember_me}
//                 onChange={handleChange}
//               />
//             }
//             label="Remember me"
//           />

//           {/* Submit Button */}
//           <Button type="submit" variant="contained" disableElevation fullWidth>
//             LOG IN
//           </Button>

//           {/* Forgot password link */}
//           <Link
//             href="#"
//             variant="body2"
//             color="error"
//             sx={{ alignSelf: "center" }}
//           >
//             Forgot password?
//           </Link>
//           <Divider>or</Divider>

//           {/* Signup Link */}
//           <Typography variant="body2" align="center">
//             Don&apos;t have an account?{" "}
//             <Link href="/register" variant="body2">
//               Sign up
//             </Link>
//           </Typography>
//         </Box>
//       </Card>
//     </Box>
//   );
// }
