import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';

export interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'contained' | 'outlined' | 'text';
  isLoading?: boolean;
  loadingText?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  loadingText,
  disabled,
  ...props
}) => {
  return (
    <MuiButton
      {...props}
      disabled={disabled || isLoading}
      startIcon={isLoading ? <CircularProgress size={16} /> : props.startIcon}
    >
      {isLoading ? (loadingText || 'Loading...') : children}
    </MuiButton>
  );
}; 