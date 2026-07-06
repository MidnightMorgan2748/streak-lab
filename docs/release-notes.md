# Release Notes - StreakLab v1.0.0 ⚡

## Release Metadata
*   **Tag Name**: `v1.0.0`
*   **Target**: `main`
*   **Release Title**: `StreakLab v1.0.0`

---

## 📝 Overview
StreakLab is a high-performance, offline-first desktop application designed to help users track recurring habits and build long-term consistency. Built using React, TypeScript, and Rust (via Tauri v2), StreakLab runs a sandboxed local SQLite database file, guaranteeing that your data remains 100% private and offline on your computer.

This is the official **v1.0.0 stable release** of StreakLab, featuring visual theme controls, date constraints, single-workspace sharing tools, and compiled installer packages for Windows.

---

## 🚀 Key Features

*   **Interactive Habits Grid**: A clean, month-by-month spreadsheet check-in grid. Includes a sticky left-aligned column for habit names to support horizontal scrolling on smaller viewports.
*   **Flexible Habit Scheduling**: Configure habits to recur daily, weekly (with specific weekday toggles), or monthly (on a specific date).
*   **Today's Schedule Checklist**: Landing dashboard displaying your overall statistics and a dynamic checkout list of tasks scheduled for today.
*   **Habit Analytics**: Live computation of **Current Streaks** (with flame 🔥 indicators), **Longest Streaks**, and overall **Completion Rate** directly from SQLite.
*   **Workspace Sharing & Portability**: 
    *   **Single Workspace Export**: Compile individual workspaces (with all habits and completion history) as a JSON file to share with friends.
    *   **Single Workspace Import**: Click "Import Workspace" in the header to select and merge shared workspaces into your local database.
    *   **Full Backups**: Export a full JSON backup of all tables in one click from the Settings page.

---

## 🎨 Improvements & Theme Support
*   **Notion-Style Light & Slate Dark Modes**: Overhauled the color styling blocks in all pages (Dashboard, Workspaces, Workspace Detail, Settings, Navigation Layouts) to read semantic CSS variables. The entire app seamlessly adapts when toggling themes in Settings.
*   **Clean Scrollbar & Resizing Resets**: Styled scrollbar channels to render as thin, high-contrast tracks in both light and dark themes.

---

## 🐛 Bug Fixes & Stability
*   **SQLite Cascade Deletes**: Enforced `PRAGMA foreign_keys = ON;` in the connection singleton, fixing a bug where deleting a parent workspace or task would leave orphaned child records in the database.
*   **Out-of-Schedule & Previous Days Check-in Lock**: Prevented check-in checkboxes from being editable on days when a task is not scheduled, and locked editing for previous/future days.
*   **Boilerplate Cleanup**: Purged unused store scripts (`useTestStore.ts`) and redirected standard boilerplate READMEs.

---

## 🛠️ Technology Stack
*   React 19 & TypeScript 5
*   Tailwind CSS v4
*   Rust & Tauri v2
*   Zustand 5 (State Management)
*   SQLite (`tauri-plugin-sql` wrapper)

---

## 💾 Installation & Sharing Instructions
1.  Download **`StreakLab_1.0.0_x64-setup.exe`** or **`StreakLab_1.0.0_x64_en-US.msi`** from the release assets.
2.  Double-click the installer file and follow the Windows setup instructions.
3.  Launch **StreakLab** from your Start Menu!
