import { db } from "../../firebase/firebase-config";
import { setDoc, doc, collection, updateDoc, arrayUnion } from "firebase/firestore";

interface Group {
  name: string;
  teachers: string[];
}

export async function addGroup(group: Partial<Group>, user: any, id: string) {
  if (!group.name) throw new Error("Group name is required");

  try {
    // Reference to the group document
    const groupRef = doc(db, 'E-groups', id, 'sub-groups', group.name);

    // Save the group metadata
    await setDoc(groupRef, { name: group.name, teachers: group.teachers || [] });

    console.log("Group metadata saved!");

    // Create empty subcollections with a placeholder document
    await setDoc(doc(collection(groupRef, 'documents'), 'placeholder'), { createdAt: new Date() });
    await setDoc(doc(collection(groupRef, 'videos'), 'placeholder'), { createdAt: new Date() });
    await setDoc(doc(collection(groupRef, 'liveSessions'), 'placeholder'), { createdAt: new Date() });

    console.log("Empty subcollections created!");

    // Update the main E-groups document
    const eGroupRef = doc(db, 'E-groups', id);
    await updateDoc(eGroupRef, {
      teachers: arrayUnion(group.name),
      students: [],
    });

    console.log('Group and empty subcollections saved successfully:', groupRef.id);
  } catch (error) {
    console.error('Error saving group:', error);
    throw new Error('Failed to save group');
  }
}
