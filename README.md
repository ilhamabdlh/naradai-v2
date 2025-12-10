
  # AI Social Intelligence Platform

  This is a code bundle for AI Social Intelligence Platform. The original project is available at https://www.figma.com/design/bhHTzRcPyb4o9bYRHqTiV6/AI-Social-Intelligence-Platform.

  ## Setup Environment Variables

  Buat file `.env` di root project dengan konfigurasi berikut:

  ```env
  # API Configuration
  # Base URL untuk backend API
  VITE_API_BASE_URL=http://localhost:8080/api/v1
  ```

  **Contoh konfigurasi untuk berbagai environment:**

  - **Development (Local):**
    ```env
    VITE_API_BASE_URL=http://localhost:8080/api/v1
    ```

  - **Staging:**
    ```env
    VITE_API_BASE_URL=https://api.staging.teoremaintelligence.com/api/v1
    ```

  - **Production:**
    ```env
    VITE_API_BASE_URL=https://api.teoremaintelligence.com/api/v1
    ```

  > **Catatan:** File `.env` tidak akan di-commit ke git. Pastikan untuk membuat file `.env` sendiri berdasarkan kebutuhan environment Anda.

  ## Running the code

  1. Install dependencies:
     ```bash
     npm i
     ```

  2. Buat file `.env` di root project (lihat contoh di atas)

  3. Start development server:
     ```bash
     npm run dev
     ```

  Server akan berjalan di `http://localhost:3000` dan akan menggunakan API base URL dari file `.env`.
  