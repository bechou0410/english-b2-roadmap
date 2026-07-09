# Bật đăng nhập & đồng bộ đa thiết bị (Supabase)

Website là site tĩnh — phần đăng ký/đăng nhập + đồng bộ dùng Supabase (miễn phí) làm nơi lưu tiến trình. Làm một lần ~5 phút.

## Cần làm

### 1. Tạo project Supabase
- Vào https://supabase.com → đăng ký (miễn phí) → **New project**.
- Đặt tên, chọn region gần (Singapore), đặt mật khẩu database (tùy ý, không dùng lại ở đâu khác).
- Chờ ~1 phút cho project khởi tạo.

### 2. Tạo bảng + bảo mật (RLS)
Vào **SQL Editor** → **New query**, dán và chạy:

```sql
-- Bảng lưu tiến trình: mỗi tài khoản đúng 1 dòng
create table if not exists public.progress (
  user_id uuid primary key references auth.users on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Bật Row Level Security: mỗi người chỉ đọc/ghi dòng của chính mình
alter table public.progress enable row level security;

create policy "own row - select" on public.progress
  for select using (auth.uid() = user_id);
create policy "own row - insert" on public.progress
  for insert with check (auth.uid() = user_id);
create policy "own row - update" on public.progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

### 3. (Khuyến nghị) Tắt xác nhận email
Để đăng ký xong **đăng nhập được ngay**, không phải chờ email:
- **Authentication → Providers → Email** → tắt **Confirm email** → Save.
- (Nếu để bật: người dùng phải bấm link trong email trước khi đăng nhập.)

### 4. Lấy 2 khoá và dán vào web
- **Project Settings → API**:
  - **Project URL** (dạng `https://xxxx.supabase.co`)
  - **Project API keys → `anon` `public`** (một chuỗi dài)
- Mở file `english-b2-roadmap/sync-config.js`, điền:

```js
window.B2_SYNC = {
  supabaseUrl: "https://xxxx.supabase.co",
  supabaseKey: "eyJ...anon-public-key...",
};
```

- Nếu deploy bằng GitHub Pages: `git add sync-config.js && git commit -m "chore: bật đồng bộ Supabase" && git push`.

Xong. Nút 👤 trên thanh trên cùng giờ có form **Đăng ký / Đăng nhập**. Đăng nhập trên điện thoại → tiến trình tự kéo về.

## An toàn & giới hạn

- **Khoá `anon public` để công khai được** (kể cả trong repo public): RLS ở bước 2 chặn mọi truy cập ngoài dòng của chính người dùng. **Không bao giờ** dán khoá `service_role` vào `sync-config.js`.
- **Không lưu mật khẩu** trong web — Supabase Auth lo việc đó (băm phía server).
- **Hợp nhất, không ghi đè**: khi đồng bộ, mỗi kho được trộn theo tiến độ tốt nhất (điểm cao nhất, hộp thẻ SRS cao hơn, chuỗi ngày và cột mốc gộp lại) nên không mất dữ liệu giữa các thiết bị. Cùng cơ chế áp cho nút Khôi phục từ file.
- **Không cần Supabase vẫn dùng được**: để trống `sync-config.js` thì phần đám mây ẩn đi, chỉ còn **Sao lưu/Khôi phục bằng file** (tải 1 file JSON, mở trên máy khác).

## Gỡ lỗi nhanh

| Hiện tượng | Nguyên nhân thường gặp |
|---|---|
| Nút 👤 không có form đăng nhập | `sync-config.js` chưa điền, hoặc file cache — tải lại trang |
| "Email chưa được xác nhận" | Chưa tắt Confirm email (bước 3) hoặc chưa bấm link xác nhận |
| Đăng nhập được nhưng không đồng bộ | Chưa chạy SQL bước 2, hoặc policy RLS thiếu |
| "Lỗi mạng" | Mất kết nối, hoặc CDN `jsdelivr` bị chặn |
