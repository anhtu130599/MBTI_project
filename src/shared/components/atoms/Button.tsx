import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

export type ButtonProps = MuiButtonProps & {
  // Add any custom props here
  isLoading?: boolean; // Example: Add isLoading prop
};

export const Button: React.FC<ButtonProps> = ({ children, isLoading, ...props }) => {
  return (
    <MuiButton {...props} disabled={props.disabled || isLoading}>
      {isLoading ? 'Loading...' : children}
    </MuiButton>
  );
};

export default Button; 