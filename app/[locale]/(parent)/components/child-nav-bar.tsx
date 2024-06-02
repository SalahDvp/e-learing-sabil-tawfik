"use client"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { usePathname } from "@/navigation"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {Link} from "@/navigation"
import { useParentData } from "@/context/parent/fetchDataContext"
import { useChildData } from "./childDataProvider"
import { useTranslations } from "next-intl"

export function ChildNav({
    className,
    params: { slug},
    ...props
  }: React.HTMLAttributes<HTMLElement> & { params: { slug: string;} }) {
    const pathname = usePathname()
    const {childData}=useChildData()
    const t=useTranslations()
        return(
            <div className="flex flex-col border-r h-screen">
            <div className="flex flex-col items-center justify-center p-4 border-b">
              <Avatar>
                <AvatarImage alt="Profile" src="/childImage.svg?height=100&width=100" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <h2 className="mt-2 text-lg font-semibold">{childData.name}</h2>
              <span className="text-sm text-gray-500">{childData.level}{t('years')}</span>
            </div>
            <nav      className={cn(
            "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
            className
          )}
          {...props}>
              <Link className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname ==='/parent/child/[slug]'
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}      href={{pathname:'/parent/child/[slug]',params:{slug:slug}}}>
                {t('about')} </Link>
                <Link className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === '/parent/child/[slug]/Balance'
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}  href={{pathname:'/parent/child/[slug]/Balance',params:{slug:slug}}}>
                {t('Balance')} </Link>
               <Link className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === '/parent/child/[slug]/Appointments'
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )} href={{pathname:'/parent/child/[slug]/Appointments',params:{slug:slug}}}>
                {t('appointments')} </Link>
                <Link className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === '/parent/child/[slug]/Courses'
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )} href={{pathname:'/parent/child/[slug]/Courses',params:{slug:slug}}}>
                Courses </Link>
              {/*<Link className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}  href={{pathname:'/parent/child/[slug]/Family',params:{slug:slug}}}>
                Classes
              </Link> */}
            </nav>
          </div>
        )
    

}