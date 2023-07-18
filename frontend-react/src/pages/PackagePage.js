import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useState } from 'react';
import PackageList from '../components/PackageList';
import "../../node_modules/react-bootstrap/Button"
import Button from '../../node_modules/react-bootstrap/Button';
import "./PackagePage.css"


export default function PackagePage() {
const DEFAULTDATASIZE = 20;
const [dataSize, setDataSize] = useState(DEFAULTDATASIZE);
const [searchText, setSearchText] = useState("");
const [queryFilter, setQueryFilter] = useState("");

const PACKAGES = gql`
query GetPackages {
  packages ( filters:{name:{containsi:"${queryFilter}"}}, pagination:{page:1, pageSize: ${dataSize}}) {
    data {
      id,
      attributes { 
        name
        versions
        identifier
        description
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
        description
      }
    }
  }
}`

  const { loading, error, data } = useQuery(PACKAGES);

  const [selectedPage, setSelectedPage] = useState("AV");

  const searchedPackagesAP = data?.approvedPackages.data.filter(pkg => pkg.attributes.name.toUpperCase().includes(searchText.toUpperCase()) || searchText === "")

  const [selectedPaths, setSelectedPaths] = useState([])


  if (loading) return <p>Loading...</p>
  if (error) return <p>error!</p>

  function handleLoadMore(){
    setDataSize(dataSize+DEFAULTDATASIZE);
  }

  function setQueryText(){
    setDataSize(DEFAULTDATASIZE);
    setQueryFilter(searchText);
  }

  function handleEnter(e){
    if(e.code == "Enter"){
      setQueryText();
    }
  }

  function handleBtnSubmit(e){

    if(selectedPage == "AV"){
      console.log("push")
    }else{
      console.log("delete")
    }
  }

  return (
    <div id='packagePageContainer' onClick={()=>console.log(selectedPaths)}>
      <div className='searchbar'> 
        <input
          style={{
            width: '300px',
            height: '30px',
            borderRadius: '5px',
            border: 'solid darkblue',
            gridRow: 1,
            justifySelf: selectedPage=="AV"?"right":"center"
          }}
          type="text"
          placeholder="Suchen..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleEnter}
        />
        {selectedPage == "AV" && <button style={{gridRow:1, justifySelf: "left", height: "30px", marginLeft: "10px"}} onClick={setQueryText}><i className="bi bi-arrow-return-left"></i></button>}      </div>
      <div id='divChangeList'>
        <Button className='btnChangeList' style={{justifySelf: "right", backgroundColor: selectedPage=="AP"?"#b49bc5":"transparent"}} onClick={()=>{setSelectedPage("AP");setSelectedPaths([])}}>Approved</Button>
        <Button className='btnChangeList' style={{justifySelf: "left", backgroundColor: selectedPage=="AV"?"#b49bc5":"transparent"}} onClick={()=>{setSelectedPage("AV");setSelectedPaths([])}}>Available</Button>
      </div>
      <div id='pageSlider' style={{position: "relative",left: selectedPage=="AP"?"0%":"-100%"}}>
        <PackageList packages={searchedPackagesAP} selectedPaths={[]} setSelectedPaths={()=>{}}></PackageList>
        <PackageList packages={data?.packages?.data} selectedPaths={selectedPaths} setSelectedPaths={setSelectedPaths} onLoadMore={handleLoadMore}></PackageList>
      </div>
      <div id='divSubmit'>
          <button id='btnSubmit' onClick={handleBtnSubmit}>{selectedPage=="AV"?"Add Selected":"Remove Selected"}</button>
      </div>
    </div>
  );
}
