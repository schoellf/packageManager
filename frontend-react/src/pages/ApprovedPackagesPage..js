import './ApprovedPackagesPage.css'
import React, { useRef } from 'react'
import { useQuery, gql } from '@apollo/client'
import { useState } from 'react';
import PackageList from '../components/PackageList';
import installerFile from "../extraFiles/installer.exe";


const APPROVEDPACKAGES = gql`
query GetApprovedPkgs {
  approvedPackages {
    data {
      id,
      attributes { 
        name
        versions
        description
        identifier
      }
    }
  }
}`

export default function ApprovePackagesPage() {
  const { loading, error, data } = useQuery(APPROVEDPACKAGES);
  const [searchText, setSearchText] = useState("");
  const [selectedPackages, setSelectedPackages] = useState([]);
  const searchedPackages = data?data["approvedPackages"].data.filter(pkg => pkg.attributes.name.toUpperCase().includes(searchText.toUpperCase()) || searchText === ""):[]

  const downloadRef = useRef();


  if (loading) return <p>Loading...</p>
  if (error) return <p>error!</p>


  function handleCheckedOrUncheckedPackage(e, pkg) {
    if(e.target.checked) {
      //add to post request
      
    }
    else {
      //delete from post request
      //newSelectedPaths.splice(newSelectedPaths.indexOf(pkg.attributes.versions[Object.keys(pkg.attributes.versions)[0]]), 1);

    }
  }

  function getExeFilename(){
    let filename = "";

    for(let pkg of selectedPackages){
      filename+=pkg.identifier+"%"+pkg.versions[0]+"&";
    }

    return filename.slice(0,-1)+".exe";

  }


  function handleDownload(e) {
    if(selectedPackages.length>0){
      downloadRef.current.download = getExeFilename();
      downloadRef.current.click();
    }
  }

  return (
    <div className='approvedPkgsPageWrapper'>
      <div className='searchbarAP'>
        <input className='searchbarInput'
          type="text"
          placeholder="Suchen..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <div className='listOfEntries'>
        <PackageList packages={searchedPackages} selectedPackages={selectedPackages} setSelectedPackages={setSelectedPackages}></PackageList>
      </div>
      <a href={installerFile} ref={downloadRef} download={"Opera.Opera&7zip.exe"} style={{display:"none"}}>Download</a>
      <div id='divSubmit'>
        <button id='btnSubmit' onClick={handleDownload}>Download packages</button>
      </div>
    </div>
  );
}
