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
      }, 1000);
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
