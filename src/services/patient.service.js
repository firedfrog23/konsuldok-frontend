// src/services/patientData.service.js
// import apiClient from './apiClient'; // Uncomment when integrating with a real backend

// --- Mock Data Store (ensure these are let if modified by CRUD) ---
let mockLabResults = [
    { _id: 'labRes1_patientA', name: 'Complete Blood Count (CBC)', date: '2025-05-01T10:00:00Z', status: 'Results Available', summary: 'All values within normal reference ranges. No abnormalities detected.', reportUrl: '#view-report-cbc', details: 'Hemoglobin: 14.5 g/dL, WBC: 7.5 x10^3/uL, Platelets: 250 x10^3/uL. Ordered by Dr. A. Putri.' },
    { _id: 'labRes2_patientA', name: 'Lipid Panel', date: '2025-05-01T10:15:00Z', status: 'Action Required', summary: 'LDL Cholesterol slightly elevated (135 mg/dL). HDL and Triglycerides normal. Recommend dietary review and follow-up.', reportUrl: '#view-report-lipid', details: 'Total Cholesterol: 210 mg/dL, LDL: 135 mg/dL, HDL: 60 mg/dL, Triglycerides: 75 mg/dL. Ordered by Dr. A. Putri.' },
    { _id: 'labRes3_patientA', name: 'Thyroid Function Panel (TSH, T3, T4)', date: '2025-04-15T09:30:00Z', status: 'Pending', summary: 'Results are being processed by the lab. Expected by EOD.', reportUrl: null, details: 'Sample collected on April 15th. Ordered by Dr. B. Santoso.' },
    { _id: 'labRes4_patientA', name: 'Urinalysis', date: '2025-03-20T11:00:00Z', status: 'Results Available', summary: 'No significant findings. Trace protein noted, monitor if symptoms persist.', reportUrl: '#view-report-urinalysis', details: 'Color: Yellow, Clarity: Clear, pH: 6.0, Protein: Trace. Ordered by Dr. B. Santoso.' },
    { _id: 'labRes5_patientA', name: 'Glucose, Fasting', date: '2025-02-10T08:00:00Z', status: 'Results Available', summary: 'Fasting glucose within normal limits.', reportUrl: '#view-report-glucose', details: 'Glucose: 90 mg/dL. Ordered by Dr. A. Putri.' },
    { _id: 'labRes6_patientA', name: 'Vitamin D Level', date: '2025-01-05T09:00:00Z', status: 'Results Available', summary: 'Slightly below optimal range. Supplementation discussed.', reportUrl: '#view-report-vitamind', details: '25-Hydroxyvitamin D: 25 ng/mL. Ordered by Dr. C. Lestari.' },
];

let mockMedications = [
    { _id: 'med1_patientA', name: 'Metformin XR 500mg', dosage: '1 tablet twice daily with meals', nextDue: 'Today, 6:00 PM', instructions: 'Take with food to reduce stomach upset. Monitor blood sugar levels.', prescribedBy: 'Dr. Anisa Putri', prescriptionDate: '2025-01-15T00:00:00Z', refillsLeft: 2, isActive: true, type: 'Oral Tablet' },
    { _id: 'med2_patientA', name: 'Lisinopril 10mg', dosage: '1 tablet once daily (morning)', nextDue: 'Tomorrow, 8:00 AM', instructions: 'Monitor blood pressure regularly. Report any persistent cough.', prescribedBy: 'Dr. Anisa Putri', prescriptionDate: '2025-01-15T00:00:00Z', refillsLeft: 1, isActive: true, type: 'Oral Tablet' },
    { _id: 'med3_patientA', name: 'Vitamin D3 1000IU', dosage: '1 capsule daily with breakfast', nextDue: 'Today, 9:00 AM', instructions: 'Best taken with a meal containing fat for better absorption.', prescribedBy: 'Dr. Budi Santoso', prescriptionDate: '2024-11-20T00:00:00Z', refillsLeft: 0, isActive: true, type: 'Capsule' },
    { _id: 'med4_patientA', name: 'Salbutamol Inhaler', dosage: '2 puffs as needed for wheezing', nextDue: 'As Needed', instructions: 'Max 8 puffs in 24 hours. Seek medical attention if symptoms worsen.', prescribedBy: 'Dr. Budi Santoso', prescriptionDate: '2025-02-10T00:00:00Z', refillsLeft: 3, isActive: true, type: 'Inhaler' },
    { _id: 'med5_patientA', name: 'Amoxicillin 250mg (Old)', dosage: '1 tablet three times daily for 7 days', nextDue: 'N/A (Completed)', instructions: 'Finish entire course.', prescribedBy: 'Dr. Citra Lestari', prescriptionDate: '2024-10-01T00:00:00Z', refillsLeft: 0, isActive: false, type: 'Oral Tablet' },
];

let mockHealthGoals = [
    { _id: 'goal1_patientA', name: 'Daily Steps Challenge', description: 'Walk 10,000 steps daily for better cardiovascular health.', progress: 75, status: 'In Progress', target: '10,000 steps', lastUpdated: '2025-05-10T10:00:00Z', category: 'Fitness', notes: 'Using pedometer app. Feeling more energetic.' },
    { _id: 'goal2_patientA', name: 'Hydration Target', description: 'Drink 8 glasses (2 liters) of water each day.', progress: 100, status: 'Achieved Today', target: '8 glasses', lastUpdated: '2025-05-10T18:00:00Z', category: 'Nutrition', notes: 'Marked as complete for today.' },
    { _id: 'goal3_patientA', name: 'Mindfulness Practice', description: 'Meditate for 15 minutes daily to reduce stress.', progress: 30, status: 'Needs Attention', target: '15 minutes/day', lastUpdated: '2025-05-09T08:00:00Z', category: 'Wellness', notes: 'Finding it hard to make time.' },
    { _id: 'goal4_patientA', name: 'Reduce Sugar Intake', description: 'Limit sugary drinks to once a week and opt for healthier alternatives.', progress: 50, status: 'In Progress', target: 'Max 1 sugary drink/week', lastUpdated: '2025-05-08T12:00:00Z', category: 'Nutrition', notes: 'Switched to water with lemon most days.' },
];
// --- End Mock Data ---

const simulateDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getMyRecentLabResults = async (filters = { limit: 3 }) => {
    await simulateDelay(500 + Math.random() * 300);
    return mockLabResults.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, filters.limit);
};

const getAllMyLabResults = async (filters = { page: 1, limit: 10 }) => {
    await simulateDelay(700 + Math.random() * 300);
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const sortedResults = mockLabResults.sort((a, b) => new Date(b.date) - new Date(a.date));
    const paginatedResults = sortedResults.slice((page - 1) * limit, page * limit);
    return { results: paginatedResults, currentPage: page, totalPages: Math.ceil(sortedResults.length / limit), totalCount: sortedResults.length };
};

const getMyMedicationReminders = async (filters = { limit: 3 }) => {
    await simulateDelay(600 + Math.random() * 300);
    return mockMedications.filter(m => m.isActive).sort((a,b) => a.name.localeCompare(b.name)).slice(0, filters.limit);
};

const getAllMyMedications = async (filters = { page: 1, limit: 10, status: 'active' }) => {
    await simulateDelay(700 + Math.random() * 300);
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    let filteredMeds = mockMedications;
    if (filters.status === 'active') {
        filteredMeds = mockMedications.filter(m => m.isActive);
    } else if (filters.status === 'inactive') {
        filteredMeds = mockMedications.filter(m => !m.isActive);
    }
    const sortedMeds = filteredMeds.sort((a,b) => a.name.localeCompare(b.name));
    const paginatedMeds = sortedMeds.slice((page - 1) * limit, page * limit);
    return { medications: paginatedMeds, currentPage: page, totalPages: Math.ceil(sortedMeds.length / limit), totalCount: sortedMeds.length };
};

const getMyHealthGoals = async (filters = { limit: 3 }) => {
    await simulateDelay(800 + Math.random() * 300);
    return mockHealthGoals.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)).slice(0, filters.limit);
};

const getAllMyHealthGoals = async (filters = { page: 1, limit: 10 }) => {
    await simulateDelay(900 + Math.random() * 300);
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const sortedGoals = mockHealthGoals.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    const paginatedGoals = sortedGoals.slice((page - 1) * limit, page * limit);
    return { goals: paginatedGoals, currentPage: page, totalPages: Math.ceil(sortedGoals.length / limit), totalCount: sortedGoals.length };
};

const addHealthGoal = async (goalData) => {
    await simulateDelay(500);
    const newGoal = {
        _id: `goal${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        ...goalData,
        progress: parseInt(goalData.progress, 10) || 0,
        status: goalData.status || 'In Progress',
        lastUpdated: new Date().toISOString(),
    };
    mockHealthGoals.unshift(newGoal);
    return newGoal;
};

const updateHealthGoal = async (goalId, goalData) => {
    await simulateDelay(500);
    const goalIndex = mockHealthGoals.findIndex(g => g._id === goalId);
    if (goalIndex > -1) {
        mockHealthGoals[goalIndex] = {
            ...mockHealthGoals[goalIndex],
            ...goalData,
            progress: parseInt(goalData.progress, 10) || mockHealthGoals[goalIndex].progress,
            lastUpdated: new Date().toISOString()
        };
        return mockHealthGoals[goalIndex];
    }
    throw new Error("Health goal not found for update.");
};

const deleteHealthGoal = async (goalId) => {
    await simulateDelay(500);
    const initialLength = mockHealthGoals.length;
    mockHealthGoals = mockHealthGoals.filter(g => g._id !== goalId);
    if (mockHealthGoals.length === initialLength) {
        throw new Error("Health goal not found for deletion.");
    }
    return { message: "Health goal deleted successfully" };
};

const patientDataService = {
    getMyRecentLabResults,
    getAllMyLabResults,
    getMyMedicationReminders,
    getAllMyMedications,
    getMyHealthGoals,
    getAllMyHealthGoals,
    addHealthGoal,
    updateHealthGoal,
    deleteHealthGoal,
};

export default patientDataService;
