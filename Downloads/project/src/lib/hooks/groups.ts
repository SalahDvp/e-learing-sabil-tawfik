import { db } from "../../firebase/firebase-config";
import { setDoc, doc, collection ,updateDoc, arrayUnion } from "firebase/firestore";

interface Group {

  name: string;
  teachers: string[];
  documents: any[];
  videos: any[];
  liveSessions: any[];
}

export async function addGroup(group: Partial<Group>, user: any, id: any) {
  // Ensure no undefined values are being saved
  const sanitizedGroup: Group = {
    name: group.name || '',
    teachers: group.teachers || [],
    documents: group.documents || [],
    videos: group.videos || [],
    liveSessions: group.liveSessions || [],
  
  };

  try {
    // Reference a document in the subcollection
    const groupRef = doc(db, 'E-groups', id, 'sub-groups', group.name); // 'sub-groups' is the name of the subcollection

    // Save the document with the specified ID
    await setDoc(groupRef, sanitizedGroup);

    const eGroupRef = doc(db, 'E-groups', id);

    // Add the group name to the teachers array in the main document
    await updateDoc(eGroupRef, {
      teachers: arrayUnion(group.name || 'Unnamed Group')
    });

    console.log('Group saved successfully:', groupRef.id);
  } catch (error) {
    console.error('Error saving group:', error);
    throw new Error('Failed to save group');
  }
}
