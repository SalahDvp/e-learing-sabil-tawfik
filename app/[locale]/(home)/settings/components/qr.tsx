/**
 * v0 by Vercel.
 * @see https://v0.dev/t/ImfugvbdxQO
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useEffect, useState } from "react"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import QRCode from 'qrcode'
const generateQrCode = async (data: string) => {
    return QRCode.toDataURL(data);
  };
  
  const generateFirestoreId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 20; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  
  const generateUniqueIds = (count: number) => {
    const uniqueIds = new Set<string>();
    
    while (uniqueIds.size < count) {
      uniqueIds.add(generateFirestoreId());
    }
  
    return Array.from(uniqueIds);
  };
  
  const generateIdsAndQRCodes = async (count: number) => {
    const ids = generateUniqueIds(count);
    
    const idsAndQRCodesPromises = ids.map(async (id) => {
      const qrCode = await generateQrCode(id);
      return { id, qrCode };
    });
    
    return Promise.all(idsAndQRCodesPromises);
  };
export const Component = ()   => {
  const [selectedQrCode, setSelectedQrCode] = useState(null)
  const handleQrCodeClick = (qrCodeText) => {
    setSelectedQrCode(qrCodeText)
  }
  const handleCloseModal = () => {
    setSelectedQrCode(null)
  }

  const [data, setData] = useState<{ id: string, qrCode: string }[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const result = await generateIdsAndQRCodes(5);
      setData(result);
    };
    
    fetchData();
  }, []);
  

  return (
   <div className="max-w-6xl mx-auto border rounded-lg shadow-lg">
   
       
   <div className="max-h-[500px] overflow-auto">
  
     <Table>
       <TableHeader>
         <TableRow>
           <TableHead className="w-[300px] sticky top-0 bg-background">ID</TableHead>
           <TableHead className="sticky top-0 bg-background">QR Code</TableHead>
         </TableRow>
       </TableHeader>
       <TableBody>
       {data.map((item) => (
        <TableRow key={item.id}>
          <TableCell className="font-medium sticky left-0 bg-background">{item.id}</TableCell>
          <TableCell>
            <button onClick={() => handleQrCodeClick(item.id)}>
              <img src={item.qrCode} className="w-24 h-24 text-muted-foreground" alt="QR Code" />
            </button>
          </TableCell>
        </TableRow>
      ))}
       </TableBody>
     </Table>
   </div>

 </div>
  )
}


function CircleCheckIcon(props: any) {
   return (
       <svg width="232" height="232" viewBox="0 0 232 232"
            xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlnsEv="http://www.w3.org/2001/xml-events">
           <rect x="0" y="0" width="232" height="232" fill="#ffffff" />
           <defs>
               <rect id="p" width="8" height="8" />
           </defs>
       </svg>
   );
}