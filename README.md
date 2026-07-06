# StreakLab ⚡

StreakLab is an offline-first, desktop-native habit tracker and consistency sheets application. Built with React 19, TypeScript 5, and Rust via Tauri v2, it features a clean, Notion-inspired design with dynamic dark/light mode toggles, check-in spreadsheets, consistency analytics, and JSON backup portability.

---

## 📷 Screenshots

### Dashboard
*(Placeholder for Dashboard overview screenshot showing workspace summaries and today's task checklists)*

### Habit Spreadsheet Grid
*(Placeholder for Workspace detail grid view showing 31-day completions sheet, scheduled check-ins, and active habit statistics)*

---

## 🚀 Key Features

*   **Offline-First SQLite Engine**: All workspaces, habits, and completions are stored locally in a sandboxed SQLite database file, guaranteeing privacy, zero lag, and offline availability.
*   **Wix 3761 Monochromatic Aesthetics**: High-contrast, Notion-style light and slate dark mode layouts with sharp grid lines and clean typography.
*   **Interactive Month Spreadsheet Grid**: A scrollable spreadsheet displaying check-ins for each day of the month with a sticky left task column for easy navigation.
*   **Habit Scheduling & Frequency Constraints**: Configure habits for daily, weekly (select specific weekdays), or monthly schedules. Non-scheduled days are automatically locked to prevent invalid check-ins.
*   **Consistency Analytics & Streaks**: Dynamically calculates **Current Streak** (with 🔥 indicator), **Longest Streak**, and overall **Completion Rate** (excluding today if not completed yet).
*   **Dashboard Overview**: A landing hub showing active statistics (Workspaces count, Active habits, Today's completions, Weekly consistency percentage) and today's schedule checklist.
*   **Workspace Sharing & Portability**: Export individual workspaces (and their history) as shared JSON files and import them on other laptops.

---

## 🛠️ Technology Stack

*   **Frontend**: React 19, TypeScript 5, Zustand 5 (State Management), React Router 7
*   **Styles**: Tailwind CSS v4 (modern semantic custom variables)
*   **Backend & Bundler**: Rust, Tauri v2, Vite 7
*   **Database**: SQLite (`tauri-plugin-sql` wrapper with foreign key cascade deletions)

---

## 💾 Architecture Overview

StreakLab utilizes a decoupled client-server architecture inside a native desktop wrapper:

```
┌────────────────────────────────────────────────────────┐
│                   StreakLab App                        │
│                                                        │
│   ┌───────────────────────┐    ┌───────────────────┐   │
│   │    React Frontend     │◄──►│    Tauri Core     │   │
│   │ (Zustand State Store) │    │  (Rust Interop)   │   │
│   └───────────────────────┘    └─────────┬─────────┘   │
│                                          │             │
│                                          ▼             │
│                                ┌───────────────────┐   │
│                                │   SQLite Database │   │
│                                │   (streaklab.db)  │   │
│                                └───────────────────┘   │
└────────────────────────────────────────────────────────┘
```

### Database Schema
The local database `streaklab.db` is initialized on startup with the following schema:
*   **Workspaces**: Contains notebook namespaces.
*   **Tasks**: Habits tied to a workspace with configuration columns (`frequency`, `frequency_config`).
*   **Completion Entries**: Specific dates checked off by the user. Configured with a `UNIQUE(task_id, date)` constraint and `FOREIGN KEY ... ON DELETE CASCADE` to ensure database cleanliness on deletions.

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

---

## 📦 Download & Compilation Instructions

To compile the application as standalone Windows packages, run the following inside the `app/` folder:

```bash
pnpm tauri build
```

This generates:
*   **MSI Installer**: `app/src-tauri/target/release/bundle/msi/StreakLab_1.0.0_x64_en-US.msi`
*   **EXE Setup Wizard**: `app/src-tauri/target/release/bundle/nsis/StreakLab_1.0.0_x64-setup.exe`

---

## 🗺️ Product Roadmap

- [x] **v1.0.0 (Release)**: Bootstrap core layout, habit sheets, analytics engine, settings backups, and custom atomic-streak icons.
- [ ] **v1.1.0 (Next)**: Implement interactive progress charts (monthly heatmaps, completion trends).
- [ ] **v1.2.0 (Future)**: Add workspace grouping, habit categories, and archive states.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
