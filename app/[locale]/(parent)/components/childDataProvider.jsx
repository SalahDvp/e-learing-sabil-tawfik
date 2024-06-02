"use client"
import React, { createContext, useState,useContext,useEffect} from 'react';

import { useParentData } from "@/context/parent/fetchDataContext";

export const AppContext = createContext();

// Create the provider component
export const  FetchChildDataProvider = ({ children,slug}) => {
    const { parent } = useParentData();
  const childData = parent?.children.find((child) => child.id === slug);
  console.log("childdata",childData);
    if (!childData) {
      return <div>Loading...</div>;
    }
return (
    <AppContext.Provider value={{childData}}>
      {children}
    </AppContext.Provider>
  );
};
export const  useChildData =()=>{
    const value=useContext(AppContext)
    try{
    if(!value){
        throw new Error("Error not wrapped inside layout  ",)
    }   }catch(e){
        console.log(e);
    }
    return value
}
