// src/utils/constants.js

// Mirror roles from backend utils/constants.js
export const UserRoles = Object.freeze({
	ADMIN: 'Admin',
	DOCTOR: 'Doctor',
	STAFF: 'Staff',
	PATIENT: 'Patient',
});

export const AvailableUserRoles = Object.values(UserRoles);

  // Add other frontend constants here if needed