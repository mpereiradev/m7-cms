"use client";

import Link from "next/link";
import { FileText, Newspaper, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const actions = [
  {
    label: "Nova Pagina",
    href: "/pages/new",
    icon: FileText,
  },
  {
    label: "Novo Post",
    href: "/posts/new",
    icon: Newspaper,
  },
  {
    label: "Upload Midia",
    href: "/media",
    icon: Upload,
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acoes Rapidas</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {actions.map((action) => (
          <Button
            key={action.href}
            variant="outline"
            className="justify-start gap-2"
            asChild
          >
            <Link href={action.href}>
              <action.icon className="h-4 w-4" />
              {action.label}
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
