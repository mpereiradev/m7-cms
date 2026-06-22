"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type LangTabsProps = {
  children: (lang: "pt-BR" | "en") => React.ReactNode;
  defaultLang?: "pt-BR" | "en";
};

const LANGUAGES = [
  { code: "pt-BR" as const, label: "Portugues" },
  { code: "en" as const, label: "English" },
];

/**
 * Tabs wrapper for bilingual content editing.
 * Renders children once per language tab.
 */
export function LangTabs({ children, defaultLang = "pt-BR" }: LangTabsProps) {
  return (
    <Tabs defaultValue={defaultLang} className="w-full">
      <TabsList>
        {LANGUAGES.map((lang) => (
          <TabsTrigger key={lang.code} value={lang.code}>
            {lang.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {LANGUAGES.map((lang) => (
        <TabsContent key={lang.code} value={lang.code}>
          {children(lang.code)}
        </TabsContent>
      ))}
    </Tabs>
  );
}
