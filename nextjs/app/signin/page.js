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
