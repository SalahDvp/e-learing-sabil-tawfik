"use client";


import {
  AudioWaveform,
  File,
  FileImage,
  FolderArchive,
  UploadCloud,
  Video,
  X,
} from "lucide-react";
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {useTranslations} from "next-intl"
interface FileUploadProgress {
  file: File;
  source: any;
  name:string,
  subject:string
}

enum FileTypes {
  Image = "image",
  Pdf = "pdf",
  Audio = "audio",
  Video = "video",
  Other = "other",
}
type ImageUploadProps = {
  filesToUpload: FileUploadProgress[];
  setFilesToUpload: React.Dispatch<React.SetStateAction<FileUploadProgress[]>>;
};
const ImageColor = {
  bgColor: "bg-purple-600",
  fillColor: "fill-purple-600",
};

const PdfColor = {
  bgColor: "bg-blue-400",
  fillColor: "fill-blue-400",
};

const AudioColor = {
  bgColor: "bg-yellow-400",
  fillColor: "fill-yellow-400",
};

const VideoColor = {
  bgColor: "bg-green-400",
  fillColor: "fill-green-400",
};

const OtherColor = {
  bgColor: "bg-gray-400",
  fillColor: "fill-gray-400",
};

const FileUpload: React.FC<ImageUploadProps> = ({filesToUpload, setFilesToUpload }) => {
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
    const [selectedSubject,setSelectedSubject]=useState('')
    const [selectedFile,setSelectedFile]=useState<File| {name:string}>({name:''})
  const getFileIconAndColor = (file: File) => {
    if (file.type.includes(FileTypes.Image)) {
      return {
        icon: <FileImage size={40} className={ImageColor.fillColor} />,
        color: ImageColor.bgColor,
      };
    }

    if (file.type.includes(FileTypes.Pdf)) {
      return {
        icon: <File size={40} className={PdfColor.fillColor} />,
        color: PdfColor.bgColor,
      };
    }

    if (file.type.includes(FileTypes.Audio)) {
      return {
        icon: <AudioWaveform size={40} className={AudioColor.fillColor} />,
        color: AudioColor.bgColor,
      };
    }

    if (file.type.includes(FileTypes.Video)) {
      return {
        icon: <Video size={40} className={VideoColor.fillColor} />,
        color: VideoColor.bgColor,
      };
    }

    return {
      icon: <FolderArchive size={40} className={OtherColor.fillColor} />,
      color: OtherColor.bgColor,
    };
  };
  const removeFile = (file: File) => {
    setFilesToUpload((prevUploadProgress) => {
      return prevUploadProgress.filter((item) => item.file !== file);
    });

  };
  const handleFileChange = (e:any) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const onDrop =async () => {
    setFilesToUpload((prevUploadProgress:any) => {
      return [
        ...prevUploadProgress,
       {
            file: selectedFile,
            source: null,
            name:selectedFile.name,
            subject:selectedSubject
          }
        ,
      ];
    });
    setSelectedFile({name:''})
    setSelectedSubject('')
  };

  const handleDownload = (fileUploadProgress:FileUploadProgress) => {
    const url = URL.createObjectURL(fileUploadProgress.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileUploadProgress.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <div>
         <Card key="1">
      <CardHeader>
        <CardTitle>Upload Class Document</CardTitle>
        <CardDescription>Select a file to upload and choose the subject.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4" >
          <Label            className="text-right" htmlFor="file">
            File
          </Label>
          <Input  className="col-span-3" id="file" type="file"      onChange={handleFileChange}/>
      
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right" htmlFor="subject">
            Subject
          </Label>
          <Select value={selectedSubject} onValueChange={(value)=>setSelectedSubject(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
            {objectOptions.map((option) => (
              <SelectItem value={option.value}>{option.label}</SelectItem>
            ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto" type="button" onClick={onDrop}>
          Upload
        </Button>
      </CardFooter>
    </Card>
      {filesToUpload.length > 0 && (
        <div>
          <ScrollArea className="h-40">
            <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">
              {t('files-to-upload')} </p>
            <div className="space-y-2 pr-3">
              {filesToUpload.map((fileUploadProgress) => {
                return (
                  <div
         
                    key={fileUploadProgress.file.lastModified}
                    className="flex justify-between gap-2 rounded-lg overflow-hidden border border-slate-100 group hover:pr-0 pr-2"
                  >
                    <div className="flex items-center flex-1 p-2">
                      <div className="text-white"  onClick={()=>handleDownload(fileUploadProgress)}>
                        {getFileIconAndColor(fileUploadProgress.file).icon}
                      </div>

                      <div className="w-full ml-2 space-y-1">
                        <div className="text-sm flex justify-between">
                          <p className="text-muted-foreground ">
                            {fileUploadProgress.file.name.slice(0, 25)}
                          </p>
                        </div>
                        <Progress 
                          className={
                            getFileIconAndColor(fileUploadProgress.file).color
                          }
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (fileUploadProgress.source)
                          fileUploadProgress.source.cancel("Upload cancelled");
                        removeFile(fileUploadProgress.file);
                      }}
                      className="bg-red-500 text-white transition-all items-center justify-center cursor-pointer px-2 hidden group-hover:flex"
                    >
                      <X size={20} />
                    </button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
export default FileUpload