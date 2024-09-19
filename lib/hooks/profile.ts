import { db } from "@/firebase/firebase-config";
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { z } from "zod";
import { profileFormSchema } from "@/validators/general-info";
import { uploadAndLinkToCollection } from "./students";

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Reference to the unique document "GeneralInformation" in the "Profile" collection
const generalInfoDocRef = doc(db, "Profile", "GeneralInformation");

export const addProfile = async (updatedProfile: ProfileFormValues) => {
  try {
    // Check if the document exists
    const docSnap = await getDoc(generalInfoDocRef);

    if (docSnap.exists()) {
      // Document exists, so update it
      await updateDoc(generalInfoDocRef, updatedProfile); // This updates existing fields
      if (updatedProfile.photo) {
        await uploadAndLinkToCollection(updatedProfile.photo, 'Profile', 'GeneralInformation', 'photo');
      }
    } else {
      // Document does not exist, so create it
      await setDoc(generalInfoDocRef, updatedProfile); // This creates the document
      if (updatedProfile.photo) {
        await uploadAndLinkToCollection(updatedProfile.photo, 'Profile', 'GeneralInformation', 'photo');
      }
      console.log("Profile created successfully");
    }

    return true;
  } catch (error) {
    console.error("Error adding/updating profile:", error);
    throw error; // Rethrow for further handling
  }
};

export const setGeneralInformation = async (profile: ProfileFormValues) => {
  try {
    // Set (overwrite or merge) data in the specific document
    await setDoc(generalInfoDocRef, profile, { merge: true }); // Use `merge: true` to add or update fields
    console.log("General Information set successfully");
    return true;
  } catch (error) {
    console.error("Error setting general information:", error);
    throw error;
  }
};