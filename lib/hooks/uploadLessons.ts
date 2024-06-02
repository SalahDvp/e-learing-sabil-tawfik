import {ref, uploadBytes, getDownloadURL, getBlob } from "firebase/storage";
import { doc, updateDoc, collection, arrayRemove, arrayUnion } from "firebase/firestore";
import { db,storage } from "@/firebase/firebase-config";
type FileObject = {
    name: string;
    file: File;
    source:any;
    subject:string;
  };


  export async function uploadLessonsAndLinkToCollection<T>(
    level: string,
    cls: string,
    documentId: string,
    files: FileObject[],
  ): Promise<{ name: string; url: string ,subject:string }[]> {
    const collectionRef = collection(db, `Classes`);

  
    const promises = files.map(async ({ file,subject }) => {
      const name = file.name; // Extracting the file name from FileObject
      const folderRef = ref(storage, `${level}/${cls}`);
      const fileRef = ref(folderRef, name);
      const metadata = {
        customMetadata: {
          subject:subject,
        },
      };
      await uploadBytes(fileRef, file,metadata);
  
      const downloadUrl = await getDownloadURL(fileRef);
      return { name, url: downloadUrl, subject:subject };
    });
  
    const uploadedFiles = await Promise.all(promises);
  
    // Update document in Firestore with document URLs
    await updateDoc(doc(collectionRef, documentId), {
      documents: arrayUnion(...uploadedFiles),
    });
  
    return uploadedFiles; // Return the array of name and URL objects
  }
  export const updateDocuments = async (
    urlsArray: {name:string;url:string,subject:string}[],
    filesArray: FileObject[],
    level: string,
    cls: string,
    documentId: string
  ) => {
    const newArray = urlsArray;

    const newFiles = filesArray.filter((item2) =>
      !urlsArray.some((item1) => item1.name === item2.name)
    );

    
    // Perform computations for new files
    if (newFiles.length > 0) {
      const uploaded = await uploadLessonsAndLinkToCollection(
        level,
        cls,
        documentId,
        newFiles
      );
      uploaded.forEach((item) => {
        newArray.push(item);
      });
    }

    // Log deleted files (names in array2 but not in array1)
    const deletedFiles = urlsArray.filter(
      (item1) => !filesArray.some((item2) => item1.name === item2.name)
    );
  
    // Perform computations for new files
    if (deletedFiles.length > 0) {
      deletedFiles.map(async (file) => {
        await updateDoc(doc(db, 'Classes', documentId), {
          documents: arrayRemove({ name: file.name, url: file.url ,subject:file.subject}),
        });
        newArray.filter(
          (item) => !(item.name === file.name && item.url === file.url)
        );
      });
    }
    return newArray;
  };
  export async function fetchLessons(urlsArray: { name: string; url: string ,subject:string}[]): Promise<FileObject[]> {
    try {
      const filesToUpload= await Promise.all(
        urlsArray
          .filter(file => file.url) // Filter out null URLs
          .map(async file => {
            try {
              const fileRef = ref(storage, file.url); // Assuming file.url contains the full path in Cloud Storage
      
              const blob = await getBlob(fileRef);
              if (blob) {
                return { file: new File([blob], file.name, { type: blob.type }), source: null, name: file.name,subject:file.subject };
              } else {
                console.error("Error fetching file blob:", file);
                // Handle the case where blob is null (download failed)
                return null; // Returning null here; adjust as needed
              }
            } catch (error) {
              console.error("Error downloading file:", error);
              // Handle the download error
              return null; // Returning null here; adjust as needed
            }
          })
      );
    
      return filesToUpload.filter((file): file is FileObject => file !== null);
    } catch (error) {
      console.error("Error fetching files:", error);
      // Handle the overall error
      return [];
    }
  }


