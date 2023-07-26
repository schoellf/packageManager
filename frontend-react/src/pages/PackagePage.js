import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { useState } from 'react';
import PackageList from '../components/PackageList';
import "./PackagePage.css"
import "../../node_modules/react-bootstrap/Button"
import Button from '../../node_modules/react-bootstrap/Button';
import "../components/PackageList.js";


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

  const [selectedPackages, setSelectedPackages] = useState([])


  if (loading) return <p>Loading...</p>
  if (error) return <p>error!</p>

  console.log(data)
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

  function handleListChange(){
    
    setSelectedPackages([]);

    if(selectedPage === "AP"){
      setQueryFilter(searchText);
    }
  }

  return (
    <div id='pkgPageWrapper'>
      <div id='divControl'>
        <div className='searchbar'> 
          <input className='searchbarInput'
            style={{justifySelf: selectedPage=="AV"?"right":"center"}}
            type="text"
            placeholder="Suchen..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleEnter}
          />
          {selectedPage == "AV" && <button id='searchEnter' onClick={setQueryText}><i className="bi bi-arrow-return-left"></i></button>}</div>
        <div id='divChangeList'>
          <Button className='btnChangeList' style={{justifySelf: "right", backgroundColor: selectedPage=="AP"?"#b49bc5":"transparent"}} onClick={()=>{handleListChange();setSelectedPage("AP")}}>Approved</Button>
          <Button className='btnChangeList' style={{justifySelf: "left", backgroundColor: selectedPage=="AV"?"#b49bc5":"transparent"}} onClick={()=>{handleListChange();setSelectedPage("AV")}}>Available</Button>
        </div>
      </div>
      <div id='pageSlider' style={{position: "relative",left: selectedPage=="AP"?"0%":"-100%"}}>
        <PackageList packages={searchedPackagesAP} selectedPackages={selectedPackages} setSelectedPackages={setSelectedPackages} multiVersionSelect={true}></PackageList>
        <PackageList packages={data?.packages?.data} selectedPackages={selectedPackages} setSelectedPackages={setSelectedPackages} onLoadMore={handleLoadMore} multiVersionSelect={true}></PackageList>
      </div>
      <div id='divSubmit'>
        <button id='btnSubmit' onClick={handleBtnSubmit}>{selectedPage == "AV" ? "Add Selected" : "Remove Selected"}</button>
      </div>
    </div>
  );
}
