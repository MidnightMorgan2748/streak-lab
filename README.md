# StreakLab ⚡

StreakLab is an offline-first, desktop-native habit tracking and productivity sheet application. Built with React, TypeScript, and Rust via Tauri, it features a clean, Notion-inspired design with dynamic dark/light mode toggles, check-in spreadsheets, consistency analytics, and JSON backup portability.

---

## 🚀 Key Features

*   **Offline-First SQLite Engine**: All workspaces, habits, and completions are stored locally in a sandboxed SQLite database file, guaranteeing privacy, zero lag, and offline availability.
*   **Wix 3761 Monochromatic Aesthetics**: High-contrast, Notion-style light and slate dark mode layouts with sharp grid lines and clean typography.
*   **Interactive Month Spreadsheet Grid**: A scrollable spreadsheet displaying check-ins for each day of the month with a sticky left task column for easy navigation.
*   **Habit Scheduling & Frequency Constraints**: Configure habits for daily, weekly (select specific weekdays), or monthly schedules. Non-scheduled days are automatically locked to prevent invalid check-ins.
*   **Consistency Analytics & Streaks**: Dynamically calculates **Current Streak** (with 🔥 indicator), **Longest Streak**, and overall **Completion Rate** (excluding today if not completed yet).
*   **Dashboard Overview**: A landing hub showing active statistics (Workspaces count, Active habits, Today's completions, Weekly consistency percentage) and today's schedule checklist.
*   **Data Portability**: Single-click backup export of all tables into a standard, downloadable JSON file.

---

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript 5, Zustand 5 (State Management), React Router 7
*   **Styles**: Tailwind CSS v4 (modern semantic custom variables)
*   **Backend & Bundler**: Rust, Tauri v2, Vite 7
*   **Database**: SQLite (`tauri-plugin-sql` wrapper with foreign key cascade deletions)

---

## 📂 Project Structure

```bash
StreakLab/
├── app/                      # Frontend Vite + React project
│   ├── src/
│   │   ├── app/
│   │   │   ├── layouts/     # Main sidebar/outlet shell (MainLayout.tsx)
│   │   │   └── router/      # React Router declarations (index.tsx)
│   │   ├── database/        # SQLite connection singleton (db.ts)
│   │   ├── pages/           # Page views (Dashboard, Workspaces, Settings, etc.)
│   │   ├── stores/          # Zustand store definitions (workspaces, tasks, completions)
│   │   ├── utils/           # Streak and scheduled dates logic (analytics.ts)
│   │   ├── index.css        # Styling resets and CSS theme variables
│   │   └── main.tsx         # React app entry point
│   ├── package.json         # Node packaging settings
│   └── vite.config.ts       # Vite bundler configs
├── app/src-tauri/            # Rust native backend project
│   ├── capabilities/        # Tauri security capability profiles (default.json)
│   ├── src/                 # Rust source code (main.rs, lib.rs migrations)
│   ├── Cargo.toml           # Cargo package settings
│   └── tauri.conf.json      # Tauri application bundle configurations
└── README.md
```

---

## 💾 Database Architecture

The application runs a local database `streaklab.db` with the following SQLite schema:

```sql
-- Workspaces Table
CREATE TABLE IF NOT EXISTS workspaces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tasks (Habits) Table
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workspace_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    frequency TEXT NOT NULL,
    frequency_config TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

-- Completion Entries Table
CREATE TABLE IF NOT EXISTS completion_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    UNIQUE(task_id, date)
);
```

*Note: Enforces `PRAGMA foreign_keys = ON;` on connection boot to cascade-delete tasks and completion entries when their parent workspaces or tasks are removed.*

---

## 💻 Developer Installation & Setup

### Prerequisites
1.  **Node.js** (v18+) & **pnpm** installed.
2.  **Rust & Cargo** installed (via [rustup.rs](https://rustup.rs/)).
3.  *Windows specific*: Visual Studio C++ Build Tools installed.

### Setup Steps
1.  Clone the repository and navigate into the app directory:
    ```bash
    cd StreakLab/app
    ```
2.  Install frontend dependencies:
    ```bash
    pnpm install
    ```
3.  Launch the application in development mode:
    ```bash
    pnpm tauri dev
    ```
    *Tauri will automatically compile the Rust backend, compile your React frontend, and launch the native desktop window.*

---

## 📦 Compiling Production Installers

To package the application as a standalone Windows executable (`.exe`) and installer (`.msi`):

1.  Make sure you have [WiX Toolset v3](https://wixtoolset.org/) installed (Tauri will download this automatically in the background if needed).
2.  Run the Tauri build command inside the `app/` directory:
    ```bash
    pnpm tauri build
    ```
3.  Locate the generated bundles inside:
    `app/src-tauri/target/release/bundle/`

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
