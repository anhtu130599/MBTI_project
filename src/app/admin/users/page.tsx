"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    role: "",
    emailVerified: false,
  });
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (data.user.role !== "admin") {
        router.push("/");
        return;
      }
      setUser(data.user);
      fetchUsers();
    }
    checkAuth();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      username: user.username,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/admin/users/${selectedUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) throw new Error("Failed to update user");

      const updatedUser = await response.json();
      setUsers(users.map(user => 
        user._id === selectedUser._id ? { ...user, ...updatedUser.user } : user
      ));
      setEditDialogOpen(false);
    } catch (err) {
      setError("Lỗi khi cập nhật người dùng");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/admin/users/${selectedUser._id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");

      setUsers(users.filter(user => user._id !== selectedUser._id));
      setDeleteDialogOpen(false);
    } catch (err) {
      setError("Lỗi khi xóa người dùng");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý người dùng
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên đăng nhập</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</TableCell>
                <TableCell>
                  {user.emailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditClick(user)}
                    color="primary"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(user)}
                    color="error"
                    size="small"
                    disabled={user.role === 'admin'}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => router.push(`/admin/users/${user._id}`)}
                    color="info"
                    size="small"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog chỉnh sửa người dùng */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tên đăng nhập"
            fullWidth
            value={editForm.username}
            onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={editForm.email}
            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
          />
          <FormControlLabel
            control={
              <Switch
                checked={editForm.emailVerified}
                onChange={(e) => setEditForm({ ...editForm, emailVerified: e.target.checked })}
              />
            }
            label="Đã xác thực email"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa người dùng {selectedUser?.username}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 