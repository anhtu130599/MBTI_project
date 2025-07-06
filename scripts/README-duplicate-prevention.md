# Chức năng Ngăn chặn Câu hỏi Trùng lặp

## Tổng quan

Dự án MBTI Career Test đã được cải thiện với chức năng ngăn chặn câu hỏi trùng lặp ở 3 cấp độ:

### 1. **Database Level (MongoDB)**
- Unique constraint trên field `text` trong collection `questions`
- Case-insensitive index để phát hiện trùng lặp không phân biệt hoa thường
- Ngăn chặn hoàn toàn việc tạo câu hỏi trùng lặp ở database

### 2. **API Level (Backend)**
- Kiểm tra trùng lặp trước khi tạo câu hỏi mới
- Sử dụng regex để so sánh chính xác (case-insensitive)
- Trả về lỗi 409 Conflict nếu phát hiện trùng lặp

### 3. **UI Level (Frontend)**
- Kiểm tra trùng lặp ở client-side trước khi gửi request
- So sánh với danh sách câu hỏi hiện tại
- Hiển thị thông báo lỗi thân thiện cho admin

## Các file đã được cập nhật

### 1. Database Schema
```typescript
// src/core/infrastructure/database/models/Question.ts
text: {
  type: String,
  required: true,
  trim: true,
  unique: true,        // ← Mới thêm
  index: true,         // ← Mới thêm
},
```

### 2. API Route
```typescript
// src/app/api/admin/questions/route.ts
// Check for duplicate question
const existingQuestion = await Question.findOne({ 
  text: { $regex: new RegExp(`^${transformedData.text.trim()}$`, 'i') }
});

if (existingQuestion) {
  return NextResponse.json({ 
    error: 'Câu hỏi này đã tồn tại trong hệ thống. Vui lòng kiểm tra lại hoặc sử dụng câu hỏi khác.' 
  }, { status: 409 });
}
```

### 3. Frontend Validation
```typescript
// src/app/admin/questions/page.tsx
// Check for duplicate question in current list (client-side validation)
if (editIdx === null) { // Only check for new questions
  const normalizedText = form.text.trim().toLowerCase();
  const isDuplicate = questions.some(q => 
    q.text.trim().toLowerCase() === normalizedText
  );
  
  if (isDuplicate) {
    setError('Câu hỏi này đã tồn tại trong danh sách. Vui lòng kiểm tra lại!');
    return;
  }
}
```

## Scripts hỗ trợ

### 1. Kiểm tra và dọn dẹp câu hỏi trùng lặp hiện có
```bash
node scripts/cleanup-duplicate-questions.js
```

**Chức năng:**
- Tìm tất cả câu hỏi trùng lặp trong database
- Giữ lại câu hỏi cũ nhất (dựa trên createdAt)
- Xóa các câu hỏi trùng lặp còn lại
- Hiển thị báo cáo chi tiết

### 2. Tạo unique index cho database
```bash
node scripts/create-unique-index.js
```

**Chức năng:**
- Kiểm tra xem unique index đã tồn tại chưa
- Tạo unique index trên field `text` nếu chưa có
- Sử dụng collation case-insensitive
- Ngăn chặn tương lai việc tạo câu hỏi trùng lặp

## Quy trình triển khai

### Bước 1: Dọn dẹp dữ liệu hiện có
```bash
node scripts/cleanup-duplicate-questions.js
```

### Bước 2: Tạo unique index
```bash
node scripts/create-unique-index.js
```

### Bước 3: Kiểm tra build
```bash
npm run build
```

## Lưu ý quan trọng

1. **Backup database** trước khi chạy scripts
2. **Unique index** sẽ ngăn chặn hoàn toàn việc tạo câu hỏi trùng lặp
3. **Case-insensitive** - "Bạn thích gì?" và "bạn thích gì?" được coi là trùng lặp
4. **Trim whitespace** - khoảng trắng đầu cuối được loại bỏ khi so sánh

## Xử lý lỗi

### Lỗi 409 Conflict
- API trả về lỗi này khi phát hiện câu hỏi trùng lặp
- Frontend hiển thị thông báo lỗi thân thiện

### Lỗi Duplicate Key (11000)
- MongoDB trả về lỗi này khi unique constraint bị vi phạm
- Scripts sẽ hướng dẫn cách xử lý

## Lợi ích

1. **Đảm bảo chất lượng dữ liệu** - Không có câu hỏi trùng lặp
2. **Trải nghiệm người dùng tốt hơn** - Thông báo lỗi rõ ràng
3. **Hiệu suất tốt hơn** - Index giúp tìm kiếm nhanh hơn
4. **Bảo mật dữ liệu** - Ngăn chặn lỗi human error 