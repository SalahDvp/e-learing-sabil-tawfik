"use client"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { AlbumArtwork } from "./components/album-artwork"
 


import  {currentModules}from "./components/data/albums"
import { useTranslations } from "next-intl"
import { storage } from "@/firebase/firebase-config"
import { getDownloadURL, getMetadata, listAll, ref } from "firebase/storage"
import { useChildData } from "@/app/[locale]/(parent)/components/childDataProvider"
import React, { useState } from "react"
import { PodcastEmptyPlaceholder } from "./components/podcast-empty-placeholder.tsx"

interface FileMetadata {
  name: string;
  url: string;
  subject: string | null;
}
function extractFileType(contentType: string | undefined): string | null {
  if (!contentType) return null;
  const slashIndex = contentType.indexOf('/');
  if (slashIndex !== -1 && slashIndex < contentType.length - 1) {
    return contentType.substring(slashIndex + 1);
  }
  return null;
}
async function fetchFilesWithMetadata(path: string): Promise<FileMetadata[]> {
  const folderRef = ref(storage,path)
  const fileListSnapshot = await listAll(folderRef)

    
  const filesMetadataPromises = fileListSnapshot.items.map(async (itemRef) => {
    const url = await getDownloadURL(itemRef);

    const metadata = await getMetadata(itemRef);
    const subject = metadata.customMetadata?.subject || null;
    const fileType = extractFileType(metadata.contentType);
    return {
      name: itemRef.name,
      url,
      subject,
      type:fileType
    };
  });

  return Promise.all(filesMetadataPromises);
}
export default function MusicPage() {
    const t=useTranslations()
    const objectOptions = [
      { value: 'math', label: t('Mathematics') },
      { value: 'english', label: t('English') },
      { value: 'arabic', label: t('Arabic_Language') },
      { value: 'physics', label: t('physics') },
      { value: 'science', label: t('science') },
      { value: 'history', label: t('history') },
      { value: 'geography', label: t('geography')},
      { value: 'art', label: t('art') },
      { value: 'music', label: t('music') },
      { value: 'physical_education', label: t('physical-education') },
      { value: 'ict', label: t('ict-information-and-communication-technology') },
      {value:'islamic_education',label:t('Islamic_Education')},
      {value:'scientific_activities',label:t('Scientific_Activities')},
      {value:'art',label:t('Artistic_Education_and_Technological_Alertness')},
      {value:'social_science',label:t('Social_Sciences')},
      {value:'french',label:t("French_Language")}
    
    ];
    const {childData}=useChildData()
    const [files, setFiles] = React.useState<FileMetadata[]>([]);
    const [loading, setLoading] =  React.useState<boolean>(true);
    const [subject,setSubject]=React.useState<String>('math')
  
    React.useEffect(() => {
      async function fetchData() {
        try {
  
          
          const path = `${childData.level}/${childData.class}`;
          const files = await fetchFilesWithMetadata(path);

          
          setFiles(files);
        } catch (error) {
          console.error('Error fetching files:', error);
        } finally {
          setLoading(false);
        }
      }
  
      fetchData();
    }, []);
    const filteredfiles = React.useMemo(() => {
      return files.filter((module) => module.subject === subject);
    }, [files, subject]);
    const handleFilter = (classType:string) => {
      setSubject(classType)
};
  return (
<div className="space-y-6">
  <div>
    <h3 className="text-lg font-medium">{t('general-information')}</h3>
    <p className="text-sm text-muted-foreground">
      {t('this_is_how_others_will_see_your_school')}
    </p>
  </div>
  <div className="border-t">
    <div className="bg-background">
      <div className="grid lg:grid-cols-5">
        <div className="col-span-3 lg:col-span-4 lg:border-l">
          <div className="h-full px-4 py-6 lg:px-8">
            <Tabs defaultValue="math" className="h-full space-y-6">
              <div className="space-between flex items-center">
                <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
                  <TabsList>
                    {objectOptions.map((course, index) => (
                      <TabsTrigger
                        key={index}
                        value={course.value}
                        className="relative"
                        onClick={() => handleFilter(course.value)}
                      >
                        {course.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <div className="ml-auto mr-4"></div>
              </div>
              <div className="border-none p-0 outline-none">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Study {subject}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      The latest course for you
                    </p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="relative">
  <ScrollArea>
    <div className="flex flex-col space-y-4 pb-4 overflow-x-auto sm:flex-row sm:space-y-0 sm:space-x-4">
    {filteredfiles.length > 0 ? (
  filteredfiles.map((album) => (
    <AlbumArtwork
      key={album.name}
      album={album}
      className="w-[150px] sm:w-[200px] md:w-[250px]"
      aspectRatio="portrait"
      width={150}
      height={200}
    />
  ))
) : (
<PodcastEmptyPlaceholder/>
)}
    </div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
</div>
                <Separator className="my-4" />
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}