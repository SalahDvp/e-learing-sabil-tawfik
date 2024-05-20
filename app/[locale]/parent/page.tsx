"use client"
import { useTranslations } from "next-intl";

function Page() {

const t=useTranslations()

    return <>{t("parents")}...</>;
  

}
export default Page