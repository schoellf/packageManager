import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useState } from 'react';




const APPROVEDPACKAGES = gql`
query GetApprovedPkgs {
  approvedPackages {
    data {
      id,
      attributes { 
        name
        versions
      }
    }
  }
}`

export default function ApprovePackagesPage() {
  const { loading, error, data } = useQuery(APPROVEDPACKAGES);
  console.log(data);
  const [searchText, setSearchText] = useState("");
  const [selectedPackages, setSelectedPackages] = useState([[]]);
  const searchedPackages = data?data["approvedPackages"].data.filter(pkg => pkg.attributes.name.toUpperCase().includes(searchText.toUpperCase()) || searchText === ""):[]


  if (loading) return <p>Loading...</p>
  if (error) return <p>error!</p>

  console.log(selectedPackages);

  function handleCheckedOrUncheckedPackage(e, pkg) {

    if(e.target.checked) {
      //add to post request
      setSelectedPackages([...selectedPackages, pkg.attributes.versions[Object.keys(pkg.attributes.versions)[0]]])
      
    }
    else {
      //delete from post request
      
      //let newSelectedPaths = [...selectedPaths];
      //newSelectedPaths.splice(newSelectedPaths.indexOf(pkg.attributes.versions[Object.keys(pkg.attributes.versions)[0]]), 1);
      //setSelectedPaths([...newSelectedPaths])
    }
  }


  function handleDownload(e) {
    console.log("Test");
  }

  return (
    <div>
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
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {searchedPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="package-card"
            style={{ flex: '0 0 170px', margin: '20px' }}
          >
            <div
              className="packageDescr"
              style={{ float: 'left', marginRight: '10px' }}
            >
              <img src={pkg.attributes.pic} />
            </div>
            <div className="packageName">
              <h2>{pkg.attributes.name}</h2>
            </div>
            <small>{pkg.attributes.url}</small>
            <input type="checkbox" style={{ float: 'right' }} onChange={e => {handleCheckedOrUncheckedPackage(e, pkg)}}/>
          </div>
        ))}
      </div>
      <button onClick={handleDownload}>Button</button>
    </div>
  );
}
