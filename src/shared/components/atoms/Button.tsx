import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

export interface ButtonProps extends MuiButtonProps {
  // Add any custom props here
}

export const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return <MuiButton {...props}>{children}</MuiButton>;
};

export default Button; 