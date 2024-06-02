import Image from "next/image"
import { PlusCircledIcon } from "@radix-ui/react-icons"
import React from "react"
import { cn } from "@/lib/utils"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

import { playlists } from "./data/playlists"
import CsvIcon  from '@/public/FilesIcons/CSV.svg';
import DocIcon from '@/public/FilesIcons/DOC.svg';
import DocxIcon from '@/public/FilesIcons/DOCX.svg';
import JpgIcon from '@/public/FilesIcons/JPG.svg';
import MovIcon from '@/public/FilesIcons/MOV.svg';
import Mp3Icon from '@/public/FilesIcons/MP3.svg';
import Mp4Icon from '@/public/FilesIcons/MP4.svg';
import PdfIcon from '@/public/FilesIcons/PDF.svg';
import PngIcon from '@/public/FilesIcons/PNG.svg';
import PptIcon from '@/public/FilesIcons/PPT.svg';
import TxtIcon from '@/public/FilesIcons/TXT.svg';
const fileIcons:any= {
  csv: CsvIcon as any,
  doc: DocIcon,
  docx: DocxIcon,
  jpg: JpgIcon,
  mov: MovIcon,
  mp3: Mp3Icon,
  mp4: Mp4Icon,
  pdf: PdfIcon,
  png: PngIcon,
  ppt: PptIcon,
  txt: TxtIcon,
};
interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  album: any
  aspectRatio?: "portrait" | "square"
  width?: number
  height?: number
}

const getFileIcon = (fileType:any) => {
  return fileIcons[fileType.toLowerCase()] || null;
};
const AlbumIcon = ({ albumType}:{albumType:string}) => {
  const AlbumComponent = getFileIcon(albumType);
  if (AlbumComponent) {
    return <AlbumComponent />;
  }
  return null; // or any default icon/component
};
export function AlbumArtwork({
  album,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: AlbumArtworkProps) {
  const fileIconSrc = React.useMemo(() => getFileIcon(album.type), [album.type]);
  const handleDownload = () => {
    if (album.url) {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      
      xhr.onload = (event) => {
        const blob = xhr.response;
        if (blob) {
          const url = window.URL.createObjectURL(blob);
      
          const link = document.createElement('a');
          link.href = url;
          link.download = album.name; // Set the download attribute to the actual file name
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }
      };
      
      xhr.onerror = (event) => {
        console.error('Error fetching file:', xhr.statusText);
      };
      
      xhr.open('GET', album.url);
      xhr.send();
    }
  };
  
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>

          <div className="overflow-hidden rounded-md" id='myimg'>
          <AlbumIcon albumType={album.type} />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-40">
          <ContextMenuItem onClick={()=>window.open(album.url, '_blank')}>Open in new Tab</ContextMenuItem>
          <ContextMenuItem onClick={()=>handleDownload()}>Download</ContextMenuItem>
          <ContextMenuSeparator />
        </ContextMenuContent>
      </ContextMenu>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{album.name}</h3>
        {/* <p className="text-xs text-muted-foreground">{album?.instructor}</p> */}
      </div>
    </div>
  )
}