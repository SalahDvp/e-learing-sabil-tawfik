import React from 'react'
import { Link } from "@/navigation"
import {Home,Package2,} from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider
  } from "@/components/ui/tooltip"
import { useParentData } from '@/context/parent/fetchDataContext'



export function MainNav({
    className,
    ...props
  }: React.HTMLAttributes<HTMLElement>) {
const {parent}=useParentData()


  return (
<aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex ">

    <nav className="flex flex-col items-center gap-4 px-2 sm:py-5"   {...props}>
    <Link
      href="/"
      className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
    >
      <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
      <span className="sr-only">Acme Inc</span>
    </Link>
    < TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href="/parent"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
        >
          <Home className="h-5 w-5" />
          <span className="sr-only">Dashboard</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">Dashboard</TooltipContent>
    </Tooltip>
    {parent?.children?.map((child:any, index:number) => (
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            <Link
          href={{pathname:'/parent/child/[slug]',params:{slug:child.id}}}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
   <img src="/childImage.png" alt="description" className="h-5 w-5 rounded-full" />
              <span className="sr-only">{child.name}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">{child.name}</TooltipContent>
        </Tooltip>
              ))}

    </TooltipProvider>
  </nav>

</aside>

  )
  }