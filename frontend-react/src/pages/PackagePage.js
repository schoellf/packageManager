import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useState } from 'react';



const PACKAGES = gql`
query GetPackages {
  packages {
    data {
      id,
      attributes { 
        name
      }
    }
  }
}`


export default function PackagePage() {
  const { loading, error, data } = useQuery(PACKAGES);
  const [searchText, setSearchText] = useState("");
  const searchedPackages = data?.packages.data.filter(pkg => pkg.attributes.name.toUpperCase().includes(searchText.toUpperCase()) || searchText === "")

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
              i
            </div>
            <div className="packageName">
              <h2>{pkg.attributes.name}</h2>
            </div>
            <small>{pkg.attributes.url}</small>
            <input type="checkbox" style={{ float: 'right' }} onChange={handleCheckedOrUncheckedPackage}/>
          </div>
        ))}
      </div>
    </div>
  );
}
