/* Cấu hình đồng bộ đám mây (Supabase).
   ĐỂ BẬT đăng ký/đăng nhập + đồng bộ đa thiết bị:
   1. Tạo project miễn phí tại https://supabase.com (~3 phút).
   2. Vào Project Settings → API, copy "Project URL" và khoá "anon public".
   3. Dán vào hai dòng dưới đây rồi lưu (git commit + push nếu dùng GitHub Pages).
   4. Chạy đoạn SQL trong SYNC-SETUP.md (cùng thư mục này) để tạo bảng + bảo mật (RLS).
   5. (Khuyến nghị) Tắt "Confirm email" trong Authentication → Providers → Email
      để đăng ký xong đăng nhập được ngay.

   Khoá "anon public" AN TOÀN khi để công khai: chính sách RLS đảm bảo mỗi
   tài khoản chỉ đọc/ghi được đúng dữ liệu của mình. TUYỆT ĐỐI không dán khoá
   "service_role" vào đây.

   Để trống hai giá trị này thì tính năng đám mây tự ẩn đi; nút "Sao lưu / khôi
   phục bằng file" vẫn dùng được mà không cần tài khoản. */
window.B2_SYNC = {
  supabaseUrl: "https://qlycqpjvwvlwlzqjbgku.supabase.co",
  supabaseKey: "sb_publishable_ZMp6seD_BzYoSrwo3lmc8w_NE6aWRTz",
};
