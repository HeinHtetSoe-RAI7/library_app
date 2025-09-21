// components/FormInput.js
import React from "react";
import { TextField, FormControl } from "@mui/material";

const FormInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  helperText,
  placeholder,
  required = true,
}) => {
  return (
    <FormControl fullWidth>
      <TextField
        id={id}
        name={id}
        label={label}
        type={type}
        value={value}
        onChange={onChange}
        error={error}
        helperText={helperText}
        placeholder={placeholder}
        required={required}
      />
    </FormControl>
  );
};

export default FormInput;
