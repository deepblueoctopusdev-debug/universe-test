import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { getPageSubmenu } from "./pageSubmenuConfig";

export function PageSubmenu() {
  const [location] = useLocation();
  const config = getPageSubmenu(location);

  if (!config) return null;

  return (
    <div className="flex items-stretch border-b border-slate-200 bg-white/80 backdrop-blur-sm shrink-0" data-testid="page-submenu">
      <div className="flex items-center gap-1 px-3 border-r border-slate-200 shrink-0">
        <span className="text-[10px] font-orbitron font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
          {config.label}
        </span>
        <ChevronRight className="w-3 h-3 text-slate-300" />
      </div>

      <div className="flex items-stretch overflow-x-auto scrollbar-hide flex-1">
        {config.sections.map((section, sIdx) => (
          <div key={section.title} className="flex items-stretch">
            {sIdx > 0 && <div className="w-px bg-slate-200 self-stretch my-1.5 shrink-0" />}
            <div className="flex items-center gap-0.5 px-2">
              <span className="text-[8px] font-bold uppercase tracking-[0.15em] text-slate-300 mr-1 shrink-0">
                {section.title}
              </span>
              {section.items.map((item) => (
                <Link key={item.key} href={item.href}>
                  <div
                    className={cn(
                      "px-2.5 py-1.5 text-[11px] font-medium rounded-sm cursor-pointer transition-all whitespace-nowrap",
                      location === item.href
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent"
                    )}
                  >
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PageSubmenu;
