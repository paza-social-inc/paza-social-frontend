// 'use client';

// export interface NarrativeEvidence {
//   text: string;
//   author: string | null;
//   source: string;
//   url: string | null;
// }

// export interface NarrativeSection {
//   heading: string;
//   paragraphs: string[];
//   evidence?: NarrativeEvidence[];
// }

// export interface NarrativeReport {
//   title: string;
//   generatedAt: string;
//   abstract: string;
//   sections: NarrativeSection[];
//   methodologyNote: string;
// }

// export function NarrativeReportDocument({ report }: { report: NarrativeReport }) {
//   return (
//     <div className="bg-white text-neutral-900 rounded-lg shadow-sm border max-w-3xl mx-auto p-10 md:p-14 font-serif">
//       <div className="border-b pb-6 mb-8">
//         <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">
//           Paza Intelligence · Market Report
//         </p>
//         <h1 className="text-3xl font-bold leading-tight">{report.title}</h1>
//         <p className="text-sm text-neutral-500 mt-2">
//           Generated {new Date(report.generatedAt).toLocaleString()}
//         </p>
//       </div>

//       <div className="mb-10">
//         <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500 mb-2">
//           Abstract
//         </h2>
//         <p className="text-base leading-relaxed text-neutral-800">{report.abstract}</p>
//       </div>

//       {report.sections.map((section, idx) => (
//         <div key={idx} className="mb-10">
//           <h2 className="text-xl font-bold mb-3 border-b pb-1">
//             {idx + 1}. {section.heading}
//           </h2>
//           {section.paragraphs.map((p, pIdx) => (
//             <p key={pIdx} className="text-base leading-relaxed text-neutral-800 mb-3">
//               {p}
//             </p>
//           ))}

//           {section.evidence && section.evidence.length > 0 && (
//             <div className="mt-4 space-y-3">
//               {section.evidence.map((e, eIdx) => (
//                 <blockquote
//                   key={eIdx}
//                   className="border-l-2 border-neutral-300 pl-4 italic text-sm text-neutral-600"
//                 >
//                   &quot;{e.text}&quot;
//                   <footer className="not-italic text-xs text-neutral-400 mt-1">
//                     — {e.author ? `@${e.author}` : 'Unknown'} on {e.source}
//                     {e.url && (
//                       <>
//                         {' · '}
//                         <a href={e.url} target="_blank" rel="noopener noreferrer" className="underline">
//                           source
//                         </a>
//                       </>
//                     )}
//                   </footer>
//                 </blockquote>
//               ))}
//             </div>
//           )}
//         </div>
//       ))}

//       <div className="mt-12 pt-6 border-t text-xs text-neutral-500 leading-relaxed">
//         <strong>Methodology:</strong> {report.methodologyNote}
//       </div>
//     </div>
//   );
// }
// components/SocialListening/NarrativeReportDocument.tsx

'use client';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

export interface NarrativeEvidence {
  text: string;
  author: string | null;
  source: string;
  url: string | null;
}

export interface NarrativeSection {
  heading: string;
  paragraphs: string[];
  evidence?: NarrativeEvidence[];
}

export interface NarrativeReport {
  title: string;
  generatedAt: string;
  abstract: string;
  sections: NarrativeSection[];
  methodologyNote: string;
}

export interface NarrativeReportDocumentHandle {
  download: () => void;
}

export const NarrativeReportDocument = forwardRef<NarrativeReportDocumentHandle, { report: NarrativeReport }>(
  ({ report }, ref) => {
    const reportRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
      if (!reportRef.current) return;
      setIsDownloading(true);

      try {
        const html2pdf = (await import('html2pdf.js')).default;
        const filename = `${report.title.replace(/[^a-z0-9]+/gi, '_').toLowerCase()}.pdf`;

        await html2pdf()
          .set({
            margin: [15, 15, 15, 15],
            filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          })
          .from(reportRef.current)
          .save();
      } catch (err) {
        console.error('Failed to generate PDF:', err);
      } finally {
        setIsDownloading(false);
      }
    };

    // Expose the download method to parent via ref
    useImperativeHandle(ref, () => ({
      download: handleDownload,
    }));

    return (
      <div>
        {/* Internal download button (optional – keep it for convenience) */}
        <div className="flex justify-end max-w-3xl mx-auto mb-4">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isDownloading ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>

        <div
          ref={reportRef}
          className="bg-white text-neutral-900 rounded-lg shadow-sm border max-w-3xl mx-auto p-10 md:p-14 font-serif"
        >
          {/* ... rest of the report content (unchanged) ... */}
          <div className="border-b pb-6 mb-8">
            <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">
              Paza Intelligence · Market Report
            </p>
            <h1 className="text-3xl font-bold leading-tight">{report.title}</h1>
            <p className="text-sm text-neutral-500 mt-2">
              Generated {new Date(report.generatedAt).toLocaleString()}
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500 mb-2">Abstract</h2>
            <p className="text-base leading-relaxed text-neutral-800">{report.abstract}</p>
          </div>

          {report.sections.map((section, idx) => (
            <div key={idx} className="mb-10">
              <h2 className="text-xl font-bold mb-3 border-b pb-1">
                {idx + 1}. {section.heading}
              </h2>
              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-base leading-relaxed text-neutral-800 mb-3">
                  {p}
                </p>
              ))}
              {section.evidence && section.evidence.length > 0 && (
                <div className="mt-4 space-y-3">
                  {section.evidence.map((e, eIdx) => (
                    <blockquote
                      key={eIdx}
                      className="border-l-2 border-neutral-300 pl-4 italic text-sm text-neutral-600"
                    >
                      &quot;{e.text}&quot;
                      <footer className="not-italic text-xs text-neutral-400 mt-1">
                        — {e.author ? `@${e.author}` : 'Unknown'} on {e.source}
                        {e.url && (
                          <>
                            {' · '}
                            <a href={e.url} target="_blank" rel="noopener noreferrer" className="underline">
                              source
                            </a>
                          </>
                        )}
                      </footer>
                    </blockquote>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="mt-12 pt-6 border-t text-xs text-neutral-500 leading-relaxed">
            <strong>Methodology:</strong> {report.methodologyNote}
          </div>
        </div>
      </div>
    );
  }
);

NarrativeReportDocument.displayName = 'NarrativeReportDocument';