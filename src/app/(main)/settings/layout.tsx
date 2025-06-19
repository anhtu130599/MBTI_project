'use client';

import React from 'react';
import { Container, Grid, Card, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/shared/constants';

const menuItems = [
  { text: 'Cập nhật hồ sơ', href: ROUTES.SETTINGS_PROFILE, icon: <AccountCircle /> },
  { text: 'Đổi mật khẩu', href: ROUTES.SETTINGS_CHANGE_PASSWORD, icon: <Lock /> },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Card>
            <List>
              {menuItems.map((item) => (
                <ListItem key={item.href} disablePadding>
                  <ListItemButton
                    component={Link}
                    href={item.href}
                    selected={pathname === item.href}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>
        <Grid item xs={12} md={9}>
          {children}
        </Grid>
      </Grid>
    </Container>
  );
} 