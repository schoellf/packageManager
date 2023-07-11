import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useState } from 'react';



const PACKAGES = gql`
query GetReviews {
  packages {
    data {
      id,
      attributes { 
        packageName,
        packageSize,
      }
    }
  }
}`


export default function PackagePage() {
  const { loading, error, data } = useQuery(PACKAGES);
  const [searchText, setSearchText] = useState("");
  const searchedPackages = data?.packages.data.filter(pkg => pkg.attributes.packageName.toUpperCase().includes(searchText.toUpperCase()) || searchText === "")

  if (loading) return <p>Loading...</p>
  if (error) return <p>error!</p>


  return (
    <div>
      <div className='searchbar'><input style={{ width: '300px', height: '30px', borderRadius: '5px', border: 'solid darkblue', marginBottom: '10px' }}
        type="text" placeholder="Suchen..." value={searchText} onChange={(e) => setSearchText(e.target.value)} /></div>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {searchedPackages.map((pkg) => (
          <div key={pkg.id} className="package-card" style={{ flex: '0 0 170px', margin: '20px' }}>
            <div className="packagePicture" style={{ float: 'left', marginRight: '10px' }}>
              <img src={pkg.attributes.packagePic} />
            </div>
            <div className="packageName">
              <h2>{pkg.attributes.packageName}</h2>
            </div>
            <small>{pkg.attributes.packageSize + "kb"}</small>
          </div>
        ))}
      </div>
    </div>
  )
}
