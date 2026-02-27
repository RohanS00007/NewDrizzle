📄 **README.md** – _Anonymous Chatting Web Application_

---

# Anonymous Chat App

A modern, privacy‑focused web application that enables users to chat anonymously in real‑time. Built with a powerful, full‑stack TypeScript/Next.js setup and a serverless database, the project showcases best practices in authentication, database schema design, and responsive UI components.

---

## 🚀 Features

- **Anonymous messaging** – no usernames or personal data required
- **Real‑time conversations** with threaded replies
- **User impersonation tools** for admin/testing
- **Dark/Light theme support**
- **Responsive UI** with accessible components
- **Serverless backend** using Drizzle ORM and Neon database
- **Secure auth** via `better-auth` and custom providers

---

## 🛠 Tech Stack

| Layer                    | Technologies                                                                 |
| ------------------------ | ---------------------------------------------------------------------------- |
| **Framework**            | Next.js 16.1.4                                                               |
| **UI**                   | React 19.2.3, Tailwind CSS 4, shadcn/ui, Base UI, Tabler icons, lucide-react |
| **State & Data**         | @tanstack/react-query, Axios, react-hook-form                                |
| **Auth & Security**      | better-auth, dotenv, zxcvbn-ts                                               |
| **Backend / DB**         | Drizzle ORM (+ drizzle-zod), Neon Serverless, `drizzle-kit`                  |
| **Linting & Formatting** | ESLint, Prettier, @tanstack/eslint-plugin-query, TypeScript                  |
| **Misc Utilities**       | clsx, class-variance-authority, sonner (toasts), usehooks-ts, tw-animate-css |

---

## 📁 Repository Structure (excerpt)

```
my-app/
├─ app/                # Next.js pages & layouts
├─ components/         # UI + custom components
├─ db/                 # Drizzle config & schema
├─ lib/                # Shared utilities (auth, utils)
├─ server/             # Actions / server‑only code
├─ migrations/         # SQL migration files
└─ types/              # Shared TypeScript types
```

---

## 🔧 Getting Started

1. **Clone the repo**

   ```bash
   git clone <repo-url>
   cd my-app
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment**

   Copy `.env.example` to `.env` and set your Neon database URL and any auth secrets.

4. **Run development server**

   ```bash
   pnpm dev
   ```

   Visit `http://localhost:3000`.

5. **Build for production**

   ```bash
   pnpm build
   pnpm start
   ```

---

## 📝 Scripts

- `pnpm dev` – start development server
- `pnpm build` – compile for production
- `pnpm start` – launch built app
- `pnpm lint` – run ESLint

---

## 🤝 Contributing

Contributions and improvements are welcome! Please open issues or pull requests for:

- new features
- bug fixes
- performance optimizations
- documentation

---

## 📜 License

This project is [MIT licensed](LICENSE).

---

> 💡 **Tip:** The anonymous chat demo is ideal for learning modern full‑stack patterns with Next.js, React Query, Drizzle ORM, and TypeScript.  
> Feel free to explore the source and experiment!
