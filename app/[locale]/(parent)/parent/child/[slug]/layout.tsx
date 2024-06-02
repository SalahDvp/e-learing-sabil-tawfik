"use client"
import React from 'react';

import { useParentData } from "@/context/parent/fetchDataContext";
import { ChildNav } from "../../../components/child-nav-bar";
import {FetchChildDataProvider} from "../../../components/childDataProvider"
export default function RootLayout({
    children,
    params:{slug},
  }: Readonly<{
    children: React.ReactNode;
    params:{slug:string}
  }>) {

    return (
        <FetchChildDataProvider  slug={slug}>
        <div className=" space-y-6  md:block">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-2/12">
          <ChildNav params={{slug:slug}}/>
          </aside>
       
          <div className="flex-1 ">
            
             {children}
             </div>
           
        </div>
      </div>
      </FetchChildDataProvider >
    );
  }
  