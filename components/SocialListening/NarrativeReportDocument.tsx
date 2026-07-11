'use client';

interface NarrativeSection {
  heading: string;
  paragraphs: string[];
  evidence?: Array<{ text: string; author: string | null; source: string; url: string | null }>;
}

interface NarrativeReport {
  // title: string;
  // generatedAt: string;
  // abstract: string;
  // sections: NarrativeSection[];
  // methodologyNote: string;
  title: string;
  generatedAt: string;
  abstract: string;
  sections: Array<{ heading: string; paragraphs: string[]; evidence?: any[] }>;
  methodologyNote: string;
}

export function NarrativeReportDocument({ report }: { report: NarrativeReport }) {
  return (
    <div className="bg-white text-neutral-900 rounded-lg shadow-sm border max-w-3xl mx-auto p-10 md:p-14 font-serif">
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
        <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-500 mb-2">
          Abstract
        </h2>
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
                  "{e.text}"
                  <footer className="not-italic text-xs text-neutral-400 mt-1">
                    — {e.author ? `@${e.author}` : "Unknown"} on {e.source}
                    {e.url && (
                      <>
                        {" · "}
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
  );
}