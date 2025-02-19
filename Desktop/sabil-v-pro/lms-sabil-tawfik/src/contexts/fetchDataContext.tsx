import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { getDocs, collection, doc, getDoc, collectionGroup } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

interface EGroupContextType {
    egroup: any[];
    setEgroup: React.Dispatch<React.SetStateAction<any[]>>;
}

const AppContext = createContext<EGroupContextType | undefined>(undefined);

interface FetchDataProviderProps {
    children: ReactNode;
}

// Create the provider component
export const FetchDataProvider: React.FC<FetchDataProviderProps> = ({ children }) => {
    const [eStudents, setEStudents] = useState<any[]>([]);
    const [egroup, setEgroup] = useState<any[]>([]);

    // Fetch E-groups once
    useEffect(() => {
        const fetchEgroup = async () => {
            try {
                const egroupSnapshot = await getDocs(collection(db, "E-groups"));
                const egroupData = await Promise.all(
                    egroupSnapshot.docs.map(async (doc) => {
                        const subGroupsSnapshot = await getDocs(collection(db, "E-groups", doc.id, "sub-groups"));
                        const subGroups = subGroupsSnapshot.docs.map((subDoc) => ({
                            id: subDoc.id,
                            name: subDoc.data().name, // Assuming sub-group has a 'name' field
                        }));

                        return {
                            id: doc.id,
                            ...doc.data(),
                            subGroups, 
                        };
                    })
                );
                setEgroup(egroupData);
            } catch (error) {
                console.error("Error fetching egroup:", error);
            }
        };

        fetchEgroup();
    }, []);

    // Fetch E-students and match subGroupId separately
    useEffect(() => {
        const fetchEStudents = async () => {
            try {
                const studentSnapshot = await getDocs(collection(db, "E-students"));
                const studentData = studentSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                // Assign correct subGroupId based on subGroup name
                const updatedStudents = studentData.map((student) => {
                    const studentSubGroupName = student.subGroup?.[0]; // Assuming the first value in the array
                    let assignedSubGroupId = "";

                    egroup.forEach((group) => {
                        const matchedSubGroup = group.subGroups.find((sub) => sub.name === studentSubGroupName);
                        if (matchedSubGroup) {
                            assignedSubGroupId = matchedSubGroup.id;
                        }
                    });

                    return { ...student, subGroupId: assignedSubGroupId };
                });

                setEStudents(updatedStudents);
            } catch (error) {
                console.error("Error fetching E-students:", error);
            }
        };

        if (egroup.length > 0) {
            fetchEStudents();
        }
    }, [egroup]); // Runs only when egroup is updated
    
    return (
        <AppContext.Provider value={{ egroup, setEgroup,eStudents, setEStudents }}>
            {children}
        </AppContext.Provider>
    );
};

export const useData = (): EGroupContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useData must be used within a FetchDataProvider");
    }
    return context;
};
