"use client"
import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "./level/components/profile-form"
import { useTranslations } from "next-intl"
import {Component} from './components/qr'

const SettingsProfilePage = () => {
  const t=useTranslations()
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('general-information')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('this_is_how_others_will_see_your_school')} </p>
      </div>
      <Component/>
      <Separator />
      <ProfileForm />
     
    </div>
  )
}

export default SettingsProfilePage