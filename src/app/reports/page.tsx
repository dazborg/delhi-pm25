import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technical Reports",
  description: "Systematic reviews, methodology documentation, and key decisions for the Delhi PM2.5 analysis.",
};

const REPORTS = [
  {
    href: "/reports/source-apportionment",
    title: "Source Apportionment Systematic Review",
    description:
      "A systematic review of studies identifying the sources of PM2.5 in Delhi. Synthesises findings from IIT Kanpur, TERI-ARAI, and receptor modelling studies.",
    icon: "🔬",
    tag: "Systematic Review",
  },
  {
    href: "/reports/health-effects",
    title: "Health Effects Systematic Review",
    description:
      "Review of concentration-response functions linking PM2.5 to mortality and morbidity. Covers WHO meta-analyses, GBD methodology, and the GEMM model.",
    icon: "🏥",
    tag: "Systematic Review",
  },
  {
    href: "/reports/key-decisions",
    title: "Key Decisions & Assumptions",
    description:
      "Documentation of all modelling assumptions, contentious findings, and data source selection decisions. Includes areas where research disagrees.",
    icon: "⚖️",
    tag: "Transparency",
  },
  {
    href: "/methodology",
    title: "Overall Methodology",
    description:
      "How this analysis was conducted — from data collection through health impact modelling. Explains the calculation engine and its academic foundations.",
    icon: "📐",
    tag: "Methods",
  },
];

export default function ReportsIndex() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Technical Reports</h1>
        <p className="mt-3 text-lg text-slate-600 leading-relaxed">
          This analysis is backed by systematic reviews following academic best
          practice. Every data choice, modelling assumption, and limitation is
          documented for full transparency.
        </p>
      </div>

      <div className="space-y-4">
        {REPORTS.map((report) => (
          <Link
            key={report.href}
            href={report.href}
            className="block group"
          >
            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <span className="text-3xl" aria-hidden="true">
                  {report.icon}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {report.title}
                    </h2>
                    <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {report.tag}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {report.description}
                  </p>
                </div>
                <span className="text-slate-400 group-hover:text-blue-500 transition-colors mt-1">
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
