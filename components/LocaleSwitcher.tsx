'use client';
import { Button } from './ui/button';
import { GlobeIcon } from "lucide-react";
import clsx from 'clsx';
import {useParams} from 'next/navigation';
import {ChangeEvent, ReactNode, useTransition} from 'react';
import {useRouter, usePathname} from '@/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {locales} from '@/app/[locale]/components/config';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
export default function  LocaleSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale();
  function onSelectChange(event: string) {
    const nextLocale = event;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        {pathname, params},
        {locale: nextLocale}
      );
    });
  }

  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
    <Button variant="secondary" size="icon" className="rounded-full">
        <GlobeIcon className="size-5" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" defaultValue={locale}>
      <DropdownMenuLabel>Language</DropdownMenuLabel>
      <DropdownMenuSeparator />

      <DropdownMenuCheckboxItem
        checked={locale === "en"}
        onClick={() => {
          onSelectChange("en");
        }}
      >
        English
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={locale === "fr"}
        onClick={() => {
          onSelectChange("fr");
        }}
      >
        Francais
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem
        checked={locale === "ar"}
        onClick={() => {
          onSelectChange("ar");
        }}
      >
        Arabe
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>

  );
}