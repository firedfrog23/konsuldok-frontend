/* eslint-disable no-unused-vars */
// src/pages/doctor/PatientSearchPage.jsx
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNotification } from '../../contexts/NotificationContext.jsx';
// Assume a patientService exists or will be created for searching patients by staff/doctors
import { ChevronRightIcon, ExclamationTriangleIcon, InformationCircleIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';

/**
 * PatientSearchPage allows doctors and staff to search for patient records.
 * Adheres to strict 3-color palette and UI/UX standards.
 */
function PatientSearchPage() {
    const { user } = useAuth(); // For role-based UI elements or future audit logging
    const { addNotification } = useNotification();

    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('name'); // 'name', 'id', 'dob'
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    // This function would call a new method in patient.service.js
    // e.g., patientService.searchPatients({ [searchType]: searchTerm, limit: 20 })
    const handleSearch = useCallback(async (e) => {
        if (e) e.preventDefault();
        if (!searchTerm.trim()) {
            addNotification('Please enter a search term.', 'error');
            return;
        }
        setIsLoading(true);
        setError(null);
        setHasSearched(true);
        setSearchResults([]); // Clear previous results

        try {
            // Placeholder: Replace with actual API call
            // const results = await patientService.searchPatients({ [searchType]: searchTerm, limit: 20 });
            // For now, using mock results based on search term for demonstration
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
            let mockResults = [];
            if (searchTerm.toLowerCase().includes('doe')) {
                mockResults = [
                    { _id: 'patientId123', userAccount: { firstName: 'John', lastName: 'Doe', email: 'john.doe@mail.local' }, dateOfBirth: '1985-07-15T00:00:00.000Z', gender: 'Male' },
                    { _id: 'patientId456', userAccount: { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@mail.local' }, dateOfBirth: '1990-02-20T00:00:00.000Z', gender: 'Female' },
                ];
            } else if (searchTerm.toLowerCase().includes('konsuldok')) {
				mockResults = [
				{ _id: 'patientKonsul001', userAccount: { firstName: 'Konsul', lastName: 'DokPatient', email: 'patient1@konsuldok.mail' }, dateOfBirth: '1978-11-03T00:00:00.000Z', gender: 'Male' },
				];
            }
            setSearchResults(mockResults);
            if (mockResults.length === 0) {
                addNotification('No patients found matching your criteria.', 'info');
            }
        } catch (err) {
            const errorMsg = err.message || 'Failed to search for patients.';
            setError(errorMsg);
            addNotification(errorMsg, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm, searchType, addNotification]);

    const inputBaseClasses = "input input-bordered border-black/15 bg-base-100 w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";
    const selectBaseClasses = "select select-bordered border-black/15 bg-base-100 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-8 pb-4 border-b border-black/10">
                <h1 className="text-3xl md:text-4xl font-bold text-primary">Search Patient Records</h1>
                <p className="text-base-content/70 mt-1">Find patient profiles by name, ID, or date of birth.</p>
            </header>

            <form onSubmit={handleSearch} className="bg-base-200 p-6 rounded-lg shadow-md border border-black/5 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="form-control md:col-span-2">
                        <label htmlFor="searchTerm" className="label pb-1">
                            <span className="label-text text-base-content font-medium">Search Term</span>
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                <MagnifyingGlassIcon className="w-5 h-5 text-neutral opacity-40" />
                            </span>
                            <input
                                type="text"
                                id="searchTerm"
                                placeholder={searchType === 'dob' ? 'YYYY-MM-DD' : 'Enter search query...'}
                                className={`pl-10 ${inputBaseClasses}`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-control">
                        <label htmlFor="searchType" className="label pb-1">
                            <span className="label-text text-base-content font-medium">Search By</span>
                        </label>
                        <select
                            id="searchType"
                            className={selectBaseClasses}
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                        >
                            <option value="name">Name</option>
                            <option value="id">Patient ID</option>
                            <option value="dob">Date of Birth</option>
                        </select>
                    </div>
                </div>
                <div className="form-control mt-6">
                    <button type="submit" className="btn btn-primary w-full md:w-auto" disabled={isLoading}>
                        {isLoading ? <span className="loading loading-spinner loading-sm"></span> : 'Search Patients'}
                    </button>
                </div>
            </form>

            {isLoading && (
                <div className="text-center py-10"><span className="loading loading-spinner loading-lg text-primary"></span><p className="mt-2 text-base-content/70">Searching...</p></div>
            )}

            {error && !isLoading && (
                <div role="alert" className="alert alert-neutral shadow-lg my-6">
                    <ExclamationTriangleIcon className="stroke-current shrink-0 h-6 w-6 text-neutral-content"/>
                    <div><h3 className="font-bold text-neutral-content">Search Error</h3><div className="text-xs text-neutral-content/80">{error}</div></div>
                </div>
            )}

            {!isLoading && !error && hasSearched && searchResults.length === 0 && (
                <div className="text-center py-10 bg-base-200 rounded-lg shadow">
                    <InformationCircleIcon className="w-12 h-12 mx-auto text-primary mb-3" />
                    <p className="text-base-content/80">No patients found matching your search criteria.</p>
                </div>
            )}

            {!isLoading && !error && searchResults.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-neutral mb-3">Search Results ({searchResults.length})</h2>
                    {searchResults.map(patient => (
                        <Link to={`/patient/${patient._id}/chart`} key={patient._id} className="card bg-base-100 shadow-md hover:shadow-lg border border-black/10 hover:border-primary/50 transition-all duration-200 ease-in-out group block">
                            <div className="card-body p-4 flex flex-row items-center space-x-4">
                                <UserCircleIcon className="w-10 h-10 text-primary opacity-80 flex-shrink-0" />
                                <div className="flex-grow">
                                    <h3 className="card-title text-md text-primary group-hover:underline">
                                        {patient.userAccount.firstName} {patient.userAccount.lastName}
                                    </h3>
                                    <p className="text-sm text-base-content/80">ID: {patient._id}</p>
                                    <p className="text-xs text-base-content/60">
                                        DOB: {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('en-CA') : 'N/A'} | Gender: {patient.gender || 'N/A'}
                                    </p>
                                </div>
                                <ChevronRightIcon className="w-6 h-6 text-base-content/40 group-hover:text-primary transition-colors" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PatientSearchPage;
