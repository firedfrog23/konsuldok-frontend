// src/utils/constants.js

/**
 * Defines user roles used throughout the application.
 * Should mirror backend constants.
 */
export const UserRoles = Object.freeze({
    ADMIN: 'Admin',
    DOCTOR: 'Doctor',
    STAFF: 'Staff',
    PATIENT: 'Patient',
});

export const AvailableUserRoles = Object.values(UserRoles);

/**
 * Defines appointment statuses used throughout the application.
 * Should mirror backend constants.
 */
export const AppointmentStatus = Object.freeze({
    REQUESTED: 'Requested',
    CONFIRMED: 'Confirmed',
    CANCELLED: 'Cancelled',
    COMPLETED: 'Completed',
    NO_SHOW: 'NoShow',
});

export const AvailableAppointmentStatuses = Object.values(AppointmentStatus);

/**
 * Defines gender options.
 * Should mirror backend constants if used in forms.
 */
export const Genders = Object.freeze({
    MALE: 'Male',
    FEMALE: 'Female',
    OTHER: 'Other',
    PREFER_NOT_TO_SAY: 'Prefer Not To Say',
});

export const AvailableGenders = Object.values(Genders);

// Add other frontend-specific constants here as needed
// For example:
// export const DEFAULT_PAGE_LIMIT = 10;
// export const DATE_FORMAT_DISPLAY = 'PPP p'; // For date-fns
