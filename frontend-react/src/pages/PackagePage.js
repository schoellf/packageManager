import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useState } from 'react';
import PackageList from '../components/PackageList';



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
      <PackageList packages={searchedPackages}></PackageList>
    </div>
  );
}
