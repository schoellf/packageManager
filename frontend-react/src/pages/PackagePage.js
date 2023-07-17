import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useState } from 'react';
import PackageList from '../components/PackageList';
import "./PackagePage.css"
import "../../node_modules/react-bootstrap/Button"
import Button from '../../node_modules/react-bootstrap/Button';

const PACKAGES = gql`
query GetPackages {
  packages {
    data {
      id,
      attributes { 
        name
        versions
        identifier
      }
    }
  }
  approvedPackages {
    data {
      id,
      attributes { 
        name
        versions
        identifier
      }
    }
  }
}`


export default function PackagePage() {
  const { loading, error, data } = useQuery(PACKAGES);

  const [selectedPage, setSelectedPage] = useState("AV");

  const [searchText, setSearchText] = useState("");
  const searchedPackagesAV = data?.packages.data.filter(pkg => pkg.attributes.name.toUpperCase().includes(searchText.toUpperCase()) || searchText === "")
  const searchedPackagesAP = data?.approvedPackages.data.filter(pkg => pkg.attributes.name.toUpperCase().includes(searchText.toUpperCase()) || searchText === "")

  // selectedPage=="AP"?[]:
  if (loading) return <p>Loading...</p>
  if (error) return <p>error!</p>



  return (
    <div style={{height:"90%", overflow:"hidden"}}>
      <div className='searchbar'> 
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
      <div id='divChangeList'>
        <Button className='btnChangeList' style={{justifySelf: "right", backgroundColor: selectedPage=="AP"?"#b49bc5":"transparent"}} onClick={()=>setSelectedPage("AP")}>Approved</Button>
        <Button className='btnChangeList' style={{justifySelf: "left", backgroundColor: selectedPage=="AV"?"#b49bc5":"transparent"}} onClick={()=>setSelectedPage("AV")}>Available</Button>
      </div>
      <div id='pageSlider' style={{position: "relative",left: selectedPage=="AP"?"0%":"-100%"}}>
        <PackageList packages={searchedPackagesAP} selectedPaths={[]} setSelectedPaths={()=>{}}></PackageList>
        <PackageList packages={searchedPackagesAV} selectedPaths={[]} setSelectedPaths={()=>{}}></PackageList>
      </div>
      <div id='divSubmit'>
          <button id='btnSubmit'>Remove Selected</button>
      </div>
    </div>
  );
}
