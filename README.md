# KonsulDok Frontend 🖥️✨

Hey folks! This is the face of **KonsulDok** – the user interface that brings all the cool backend functionality to life. If you've seen the [KonsulDok Backend README](https://github.com/firedfrog23/konsuldok-backend), this is where all that API goodness become usable for patients, doctors, and staff.

Built with React, Vite, and a sprinkle of Tailwind CSS + DaisyUI magic, this frontend aims for a clean, responsive, and accessible user experience.

## What's This All About? (The User's View)

This is where your users will:
* Sign up, log in, and manage their accounts.
* **Patients:** Book appointments, view their medical history, track health goals, and manage medications.
* **Doctors:** Manage their schedules, view patient charts, write clinical notes, and review lab results.
* **Staff/Admins:** (Future) Access administrative dashboards and tools.

The goal is to provide an intuitive and efficient platform for everyone involved in the healthcare journey.

## ✨ Key Features & Highlights ✨

* **Modern React Stack:** Built with Vite for a super-fast development experience.
* **Responsive Design:** Looks and works great on desktops, tablets, and mobile (thanks Tailwind!).
* **Role-Based Dashboards:** Tailored experiences for Patients and Doctors (and more to come!).
* **Secure Authentication Flow:** Smooth login, registration, and password management integrated with the backend.
* **Interactive Appointment Booking:** Patients can find doctors and book slots based on real-time availability.
* **Comprehensive Patient Portal:** Access to appointments, medical records (documents, notes, labs, medications), and health goal tracking.
* **Doctor-Focused Tools:** Patient search, detailed clinical charts, and appointment management views.
* **Global State Management:** Using React Context API (`AuthContext`, `NotificationContext`) for clean state sharing.
* **Reusable Components:** A growing library of common UI elements to keep things consistent.
* **Strict 3-Color Palette UI/UX:** A key design challenge and feature! The entire UI adheres to a strict palette of **White (`#FFFFFF`)**, **Black (`#000000`)**, and **Blue (`#007FFF`)**. This is enforced through a custom DaisyUI theme in `src/index.css`. All components are designed to respect these constraints, using these colors for backgrounds, text, borders, accents, and functional states (like errors and success messages, often distinguished by iconography and context).

## 🎨 Styling Philosophy: The 3-Color Challenge

This theme is configured in `src/index.css` using DaisyUI's theming capabilities. Components across the application leverage these theme variables (`--color-primary`, `--color-neutral`, `text-primary-content`, etc.) to ensure consistency. This minimalist approach aims for a clean, professional, and accessible look.

## 🛠️ Tech Stack ("Built With")

* **Framework/Library:** React (with Vite)
* **Routing:** React Router DOM v6
* **Styling:** Tailwind CSS + DaisyUI (with a custom 3-color theme)
* **State Management:** React Context API
* **Form Handling:** React Hook Form
* **API Client:** Axios
* **Icons:** Heroicons
* **Date Formatting:** `date-fns`
* **Animations:** `framer-motion` (for subtle UI enhancements)

## 📍 Core Pages & Components

* **Layouts:**
    * `AuthLayout.jsx`: Provides a visually engaging wrapper for login, register, etc., pages, often featuring animated graphics.
    * `MainLayout.jsx`: Standard layout for authenticated users, including `Navbar.jsx` and `Footer.jsx`.
* **Authentication Pages (`src/pages/`):**
    * `LoginPage.jsx`, `RegisterPage.jsx`, `ForgotPasswordPage.jsx`, `ResetPasswordPage.jsx`
* **Main Application Pages (`src/pages/`):**
    * `DashboardPage.jsx`: Dynamically renders content based on user role (Patient or Doctor).
    * `ProfilePage.jsx`: User profile viewing and editing.
    * `AppointmentsPage.jsx` (Patient): List and manage personal appointments.
    * `BookAppointmentPage.jsx` (Patient): Form to book new appointments.
    * `AppointmentDetailPage.jsx`: Shared view for appointment details.
* **Patient-Specific Pages (`src/pages/patient/`):**
    * `MedicalRecordsPortalPage.jsx`: Central hub for health records.
    * `LabResultsPage.jsx`, `MedicationsPage.jsx`, `HealthGoalsPage.jsx`.
* **Doctor-Specific Pages (`src/pages/doctor/`):**
    * `DoctorAppointmentsPage.jsx`: Doctor's view of their schedule.
    * `PatientSearchPage.jsx`: For doctors/staff to find patients.
    * `ClinicalPatientChartPage.jsx`: Detailed patient view with tabs.
    * `MedicalNoteEditorPage.jsx` (Coming Soon)
    * `ClinicalDocumentManagementPage.jsx` (Coming Soon)
    * `LabReviewPage.jsx` (Coming Soon)
* **Reusable Components (`src/components/`):**
    * Common UI elements (`Alert`, `Button`, `InputField`, `Spinner`).
    * Feature-specific components for appointments, auth, medical records, etc.

## 🚀 Getting Started / Running Locally

1.  **Clone the repository.**
2.  **Ensure the KonsulDok Backend is running** and accessible.
3.  **Set up your environment variables:**
    * Create a `.env` file in the root of the frontend project.
    * Add `VITE_API_URL=http://localhost:YOUR_BACKEND_PORT/api` (or your actual backend URL).
4.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
5.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    This will usually start the app on `http://localhost:5173` (or another port if 5173 is busy).

## 📂 Project Structure Overview

The `src/` directory is organized as follows:

* `assets/`: Static assets like images, SVGs.
* `components/`: Reusable UI components, further organized by feature (e.g., `auth/`, `appointments/`).
* `contexts/`: Global state management using React Context (e.g., `AuthContext.jsx`).
* `hooks/`: Custom React hooks (e.g., `useAuth.js`).
* `layouts/`: Layout components that wrap pages (e.g., `MainLayout.jsx`).
* `pages/`: Top-level page components, often organized by user role or feature area.
* `routes/`: Application routing setup (`index.jsx`).
* `services/`: API interaction logic, abstracting `axios` calls.
* `utils/`: Utility functions and constants.
* `App.jsx`: Root application component.
* `main.jsx`: Entry point of the React application.
* `index.css`: Global styles, Tailwind CSS setup, and DaisyUI theme configuration.

## 🔮 Future Ideas & Enhancements

* More sophisticated animations and micro-interactions.
* Enhanced accessibility (ARIA attributes, keyboard navigation).
* Real-time updates for things like appointment statuses or messages (SignalR/WebSockets).
* Internationalization (i18n) support.
* More comprehensive test coverage.

This frontend is designed to be a solid starting point. Feel free to explore, learn, and build upon it!

---

*Happy Coding!* 🚀
*Jul*