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
    const [egroup, setEgroup] = useState<any[]>([]);
    const [estudent,setEstudent] = useState<any[]>([]);
    useEffect(() => {
        const fetchEgroup = async () => {
            try {
                const egroupSnapshot = await getDocs(collection(db, "E-groups"));
                const egroupData = await Promise.all(
                    egroupSnapshot.docs.map(async (doc) => {
                        const subGroupsSnapshot = await getDocs(collection(db, "E-groups", doc.id, "sub-groups"));
                        const subGroups = subGroupsSnapshot.docs.map((subDoc) => ({
                            id: subDoc.id,
                            ...subDoc.data(),
                        }));
                        return {
                            id: doc.id,
                            ...doc.data(),
                            subGroups, // Include subcollection data
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


    useEffect(() => {
        const fetchEStudent = async () => {
            try {
                const eStudentSnapshot = await getDocs(collection(db, "E-students"));
                const eStudentData = eStudentSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setEstudent(eStudentData);
            } catch (error) {
                console.error("Error fetching e-students:", error);
            }
        };

        fetchEStudent();
    }, []);


    return (
        <AppContext.Provider value={{ egroup, setEgroup,estudent,setEstudent }}>
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
