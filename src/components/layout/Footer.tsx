import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-semibold mb-3">About This Project</h3>
            <p className="text-sm leading-relaxed">
              An evidence-based analysis of PM2.5 air pollution in Delhi,
              combining source apportionment research with health impact modelling.
              Designed to inform policy decisions with transparent methodology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/explore" className="hover:text-white transition-colors">
                  Interactive Explorer
                </Link>
              </li>
              <li>
                <Link href="/reports/source-apportionment" className="hover:text-white transition-colors">
                  Source Apportionment Review
                </Link>
              </li>
              <li>
                <Link href="/reports/health-effects" className="hover:text-white transition-colors">
                  Health Effects Review
                </Link>
              </li>
              <li>
                <Link href="/reports/key-decisions" className="hover:text-white transition-colors">
                  Key Decisions
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-white transition-colors">
                  Methodology
                </Link>
              </li>
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h3 className="text-white font-semibold mb-3">Primary Data Sources</h3>
            <ul className="space-y-2 text-sm">
              <li>CPCB / CSE — PM2.5 monitoring data</li>
              <li>IIT Kanpur, TERI-ARAI — Source apportionment</li>
              <li>WHO — Concentration-response functions</li>
              <li>GBD 2019 — Disease burden estimates</li>
              <li>AQLI — Life expectancy impact</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm">
          <p>
            Data presented for research and policy purposes. Health estimates are modelled
            and should be interpreted with the documented caveats.
            See{" "}
            <Link href="/reports/key-decisions" className="text-blue-400 hover:text-blue-300">
              Key Decisions
            </Link>{" "}
            for full methodology notes.
          </p>
          <p className="mt-2 text-slate-500">
            Built with open data. All sources cited. Last updated: January 2025.
          </p>
        </div>
      </div>
    </footer>
  );
}
