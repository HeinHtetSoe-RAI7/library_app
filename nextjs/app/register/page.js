// pages/register.js
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import AuthForm from "@/components/AuthenticationForm/AuthForm";
import ErrorSnackbar from "@/components/ErrorSnackbar";

export default function Register() {
  const router = useRouter();

  // Form state
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
  });

  // Error states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

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

    // Email validation
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    return isValid;
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate the form inputs
    if (!validateInputs()) return;

    try {
      // Make API request for registration
      const res = await api.post(
        "/register",
        {
          username: form.username,
          password: form.password,
          email: form.email,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setSuccess("Registration successful! Redirecting to sign in...");
      setTimeout(() => {
        router.push("/signin"); // Redirect to sign-in page after successful registration
      }, 2000);
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      {/* Show Snackbar if there's an error or success */}
      <ErrorSnackbar error={error} setError={setError} />
      {success && (
        <ErrorSnackbar error={success} setError={setSuccess} isSuccess={true} />
      )}

      {/* AuthForm for the registration form */}
      <AuthForm
        type="register"
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        usernameError={usernameError}
        usernameErrorMessage={usernameErrorMessage}
        passwordError={passwordError}
        passwordErrorMessage={passwordErrorMessage}
        emailError={emailError}
        emailErrorMessage={emailErrorMessage}
        error={error}
        setError={setError}
      />
    </>
  );
}

// "use client";

// import React, { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//   Box,
//   Button,
//   CssBaseline,
//   FormControl,
//   FormLabel,
//   TextField,
//   Typography,
//   Card,
//   Link,
//   Divider,
//   Stack,
// } from "@mui/material";
// import api from "@/lib/axios";

// export default function Login() {
//   const router = useRouter();

//   // State variables for form inputs and errors
//   const [form, setForm] = useState({ username: "", password: "", email: "" });
//   const [error, setError] = useState("");
//   const [usernameError, setUsernameError] = useState(false);
//   const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
//   const [emailError, setEmailError] = useState(false);
//   const [emailErrorMessage, setEmailErrorMessage] = useState("");
//   const [passwordError, setPasswordError] = useState(false);
//   const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
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
//     if (!form.password || form.password.length < 4) {
//       setPasswordError(true);
//       setPasswordErrorMessage("Password must be at least 4 characters.");
//       isValid = false;
//     } else {
//       setPasswordError(false);
//       setPasswordErrorMessage("");
//     }

//     // Email validation
//     if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
//       setEmailError(true);
//       setEmailErrorMessage("Please enter a valid email address.");
//       isValid = false;
//     } else {
//       setEmailError(false);
//       setEmailErrorMessage("");
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
//         "/register",
//         {
//           username: form.username,
//           password: form.password,
//           email: form.email,
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       router.push("/signin"); // Redirect to sign in page
//     } catch (err) {
//       if (err.response?.data?.detail) {
//         setError(err.response.data.detail);
//       } else {
//         setError("Invalid credentials");
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
//         sx={{ maxWidth: 400, width: "100%", p: 3, borderRadius: 2 }}
//       >
//         <Typography
//           variant="h5"
//           align="center"
//           component="h1"
//           gutterBottom
//           sx={{ mb: 2, fontWeight: "bold", fontFamily: "SansPro" }}
//         >
//           REGISTER
//         </Typography>

//         <Box
//           component="form"
//           onSubmit={handleSubmit}
//           noValidate
//           sx={{ display: "flex", flexDirection: "column", gap: 2 }}
//         >
//           {/* Email input */}
//           <FormControl fullWidth>
//             <TextField
//               id="email"
//               name="email"
//               type="email"
//               label="Email"
//               placeholder="example@gmail.com"
//               required
//               value={form.email}
//               onChange={handleChange}
//               error={emailError}
//               helperText={emailErrorMessage}
//             />
//           </FormControl>

//           {/* Username input */}
//           <FormControl fullWidth>
//             <TextField
//               id="username"
//               name="username"
//               type="text"
//               label="Username"
//               placeholder="Enter your username"
//               required
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
//               placeholder="••••••"
//               required
//               value={form.password}
//               onChange={handleChange}
//               error={passwordError}
//               helperText={passwordErrorMessage}
//             />
//           </FormControl>

//           {/* Error message */}
//           {error && (
//             <Typography color="error" align="center">
//               {error}
//             </Typography>
//           )}

//           {/* Submit Button */}
//           <Button type="submit" variant="contained" disableElevation fullWidth>
//             REGISTER
//           </Button>

//           <Divider>or</Divider>

//           {/* Signup Link */}
//           <Typography variant="body2" align="center">
//             Already have an account?{" "}
//             <Link href="/signin" variant="body2">
//               Sign in
//             </Link>
//           </Typography>
//         </Box>
//       </Card>
//     </Box>
//   );
// }
