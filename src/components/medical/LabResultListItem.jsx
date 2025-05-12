// src/components/medical/LabResultListItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { BeakerIcon, DocumentArrowDownIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

/**
 * Displays a single lab result item in a list.
 * @param {object} props
 * @param {object} props.result - The lab result object.
 * Expected: { _id, name, date, status, summary, reportUrl, details }
 */
function LabResultListItem({ result }) {
    const getStatusInfo = (status) => {
        switch (status?.toLowerCase()) {
            case 'results available':
                return { textClass: 'text-success', badgeClass: 'badge-success', icon: <InformationCircleIcon className="w-4 h-4 mr-1 text-success" /> }; // Success is Blue
            case 'action required':
                return { textClass: 'text-error font-semibold', badgeClass: 'badge-error', icon: <ExclamationTriangleIcon className="w-4 h-4 mr-1 text-error" /> }; // Error is Orange
            case 'pending':
                return { textClass: 'text-base-content/70 italic', badgeClass: 'badge-ghost', icon: <ClockIcon className="w-4 h-4 mr-1 text-base-content/70" /> }; // ClockIcon needs import
            default:
                return { textClass: 'text-base-content/70', badgeClass: 'badge-ghost', icon: null };
        }
    };
    const statusInfo = getStatusInfo(result.status);

    return (
        <li className="py-4 px-2 first:pt-2 last:pb-2">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div className="flex items-start space-x-3 flex-grow min-w-0"> {/* Added min-w-0 for truncation */}
                    <BeakerIcon className={`w-7 h-7 mt-1 flex-shrink-0 ${statusInfo.textClass === 'text-error' ? 'text-secondary' : 'text-primary'}`} />
                    <div className="flex-grow min-w-0"> {/* Added min-w-0 for truncation */}
                        <p className="font-semibold text-base-content truncate" title={result.name}>{result.name}</p>
                        <p className="text-xs text-base-content/70">
                            Date: {result.date ? format(new Date(result.date), 'PPP') : 'N/A'}
                        </p>
                        <div className="flex items-center text-xs mt-0.5">
                            {statusInfo.icon}
                            <span className={`${statusInfo.textClass}`}>{result.status}</span>
                        </div>
                        {result.summary && <p className="text-xs text-base-content/80 mt-1 italic line-clamp-2" title={result.summary}>{result.summary}</p>}
                    </div>
                </div>
                <div className="mt-2 sm:mt-0 self-end sm:self-center flex-shrink-0">
                    {result.reportUrl && result.reportUrl !== '#' && result.status !== 'Pending' ? (
                        <a
                            href={result.reportUrl} // Assuming this is a direct link or a route to view
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-xs btn-outline btn-primary"
                            aria-label={`View report for ${result.name}`}
                        >
                            <DocumentArrowDownIcon className="w-4 h-4 mr-1" /> View Report
                        </a>
                    ) : result.status === 'Pending' ? (
                        <span className="text-xs text-base-content/60 italic">Awaiting results</span>
                    ) : (
                        <span className="text-xs text-base-content/60 italic">No report</span>
                    )}
                </div>
            </div>
        </li>
    );
}
// Import ClockIcon if used in getStatusInfo
import { ClockIcon } from '@heroicons/react/24/outline'; // Add this if needed

export default LabResultListItem;
