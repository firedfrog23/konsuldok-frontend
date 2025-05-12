// src/components/medical/LabResultListItem.jsx
import React from 'react';
// Link removed as not used in this version of the component (reportUrl is an <a> tag)
import { format } from 'date-fns';
import { BeakerIcon, DocumentArrowDownIcon, ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/outline';

/**
 * Displays a single lab result item in a list. Adheres to strict 3-color palette.
 * - Main icon (BeakerIcon) is Blue, unless status is 'action required' then it's Black.
 * - Text: Black, with Blue for "Results Available" status, and Black (bold) for "Action Required".
 * - "View Report" button (btn-primary outline) is Blue.
 *
 * @param {object} props - Component props.
 * @param {object} props.result - The lab result object.
 * Expected: { _id, name, date, status, summary, reportUrl, details }
 */
function LabResultListItem({ result }) {
    /**
     * Determines text class and icon based on lab result status.
     * Relies on theme where:
     * - 'success' (Results Available) maps to Blue text.
     * - 'error' (Action Required) maps to Black text (bolded for emphasis).
     * - 'ghost' (Pending/Default) maps to Black text with opacity.
     * @param {string} status - The status of the lab result.
     * @returns {object} Object with textClass and icon.
     */
    const getStatusInfo = (status) => {
        switch (status?.toLowerCase()) {
            case 'results available':
                // text-success maps to Blue text via theme
                return { textClass: 'text-success', icon: <BeakerIcon className="w-4 h-4 mr-1 text-success" /> };
            case 'action required':
                // text-error maps to Black text (as per theme for error content on black bg)
                // We'll use font-semibold for emphasis here instead of relying on a color that might not contrast well if text-error was white.
                // The main BeakerIcon will be Black for this status.
                return { textClass: 'text-base-content font-semibold', icon: <ExclamationTriangleIcon className="w-4 h-4 mr-1 text-base-content" /> };
            case 'pending':
                return { textClass: 'text-base-content/70 italic', icon: <ClockIcon className="w-4 h-4 mr-1 text-base-content/70" /> };
            default:
                return { textClass: 'text-base-content/70', icon: null };
        }
    };
    const statusInfo = getStatusInfo(result.status);
    const mainIconColorClass = result.status?.toLowerCase() === 'action required' ? 'text-neutral' : 'text-primary'; // Black for action, Blue otherwise

    return (
        // List item: White BG (base-200), Black text (base-content)
        <li className="py-4 px-2 first:pt-2 last:pb-2 transition-colors hover:bg-base-200/50 rounded-md">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div className="flex items-start space-x-3 flex-grow min-w-0">
                    {/* Main Beaker Icon: Blue by default, Black if action required */}
                    <BeakerIcon className={`w-7 h-7 mt-1 flex-shrink-0 ${mainIconColorClass}`} />
                    <div className="flex-grow min-w-0">
                        {/* Result Name: Black text */}
                        <p className="font-semibold text-base-content truncate" title={result.name}>{result.name}</p>
                        {/* Date: Black text with opacity */}
                        <p className="text-xs text-base-content/70">
                            Date: {result.date ? format(new Date(result.date), 'PPP') : 'N/A'}
                        </p>
                        {/* Status: Dynamically styled text and icon */}
                        <div className={`flex items-center text-xs mt-0.5 font-medium ${statusInfo.textClass}`}>
                            {statusInfo.icon}
                            <span>{result.status}</span>
                        </div>
                        {/* Summary: Black text with opacity */}
                        {result.summary && <p className="text-xs text-base-content/80 mt-1 italic line-clamp-2" title={result.summary}>{result.summary}</p>}
                    </div>
                </div>
                <div className="mt-2 sm:mt-0 self-end sm:self-center flex-shrink-0">
                    {/* View Report Button: btn-primary outline is Blue */}
                    {result.reportUrl && result.reportUrl !== '#' && result.status?.toLowerCase() !== 'pending' ? (
                        <a
                            href={result.reportUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-xs btn-outline btn-primary"
                            aria-label={`View report for ${result.name}`}
                        >
                            <DocumentArrowDownIcon className="w-4 h-4 mr-1" /> View Report
                        </a>
                    ) : result.status?.toLowerCase() === 'pending' ? (
                        <span className="text-xs text-base-content/60 italic">Awaiting results</span>
                    ) : (
                        <span className="text-xs text-base-content/60 italic">No report attached</span>
                    )}
                </div>
            </div>
        </li>
    );
}

export default LabResultListItem;
