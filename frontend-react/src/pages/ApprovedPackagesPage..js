import './ApprovedPackagesPage.css'
import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useState } from 'react';
import PackageList from '../components/PackageList';




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
  console.log(data);
  const [searchText, setSearchText] = useState("");
  const [selectedPaths, setSelectedPackage] = useState([]);
  const searchedPackages = data?data["approvedPackages"].data.filter(pkg => pkg.attributes.name.toUpperCase().includes(searchText.toUpperCase()) || searchText === ""):[]


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


  function handleDownload(e) {
    console.log("Test");
  }

  return (
    <div style={{height:"90%", overflow:"hidden"}}>
      <div className='searchbarAP'>
        <input
          style={{
            width: '300px',
            height: '30px',
            borderRadius: '5px',
            border: 'solid darkblue',
            marginBottom: '10px'
          }}
          type="text"
          placeholder="Suchen..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <div className='listOfEntries'>
        <PackageList packages={searchedPackages} selectedPaths={selectedPaths} setSelectedPaths={setSelectedPaths}></PackageList>
      </div>
      <div id='divSubmit'>
        <button id='btnSubmit' onClick={handleDownload}>Download packages</button>
      </div>
    </div>
  );
}
