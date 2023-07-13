import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useState } from 'react';
import Table from 'react-bootstrap/Table';



const APPROVEDPACKAGES = gql`
query GetApprovedPkgs {
  approvedPackages {
    data {
      id,
      attributes { 
        name
      }
    }
  }
}`

export default function ApprovePackagesPage() {
  const { loading, error, data } = useQuery(APPROVEDPACKAGES);
  console.log(data);
  const [searchText, setSearchText] = useState("");
  const searchedPackages = data?data["approvedPackages"].data.filter(pkg => pkg.attributes.name.toUpperCase().includes(searchText.toUpperCase()) || searchText === ""):[]


  if (loading) return <p>Loading...</p>
  if (error) return <p>error!</p>


  function handleCheckedOrUncheckedPackage(e) {

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
            <input type="checkbox" style={{ float: 'right' }} onChange={handleCheckedOrUncheckedPackage}/>
            <Table></Table>
          </div>
        ))}
      </div>
    </div>
  );
}
