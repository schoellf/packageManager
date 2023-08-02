import React, { useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'
import { useState } from 'react';
import PackageList from '../components/PackageList';
import "./PackagePage.css"
import "../../node_modules/react-bootstrap/Button"
import Button from '../../node_modules/react-bootstrap/Button';
import "../components/PackageList.js";
import restClient from "../services/rest-client-service"

export default function PackagePage() {
const DEFAULTDATASIZE = 20;
const [dataSize, setDataSize] = useState(DEFAULTDATASIZE);
const [searchText, setSearchText] = useState("");
const [queryFilter, setQueryFilter] = useState("");

const [working, setWorking] = useState(false);

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
  approvedPackages (pagination:{page:1, pageSize: 9999}) {
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


  useEffect(()=>getStatus(true),[]);

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
   console.log(getSelectedIdentifiers())
    if(selectedPage == "AV"){
      console.log("add")
      handleAddPkgs();
    }else{
      console.log("remove")
      handleRemovePkgs();
    }
    setWorking(true);
    setTimeout(getStatus,20000);
  }

  function handleListChange(){
    
    setSelectedPackages([]);

    if(selectedPage === "AP"){
      setQueryFilter(searchText);
    }
  }


  function getStatus(initialCall){
    console.log("call");
    restClient.get("https://api.github.com/repos/benidxd5/benidxd5.github.io/actions/runs?status=in_progress")
    .then((response) => response.data)
    .then((data)=>{
      console.log(data)
      if(data.total_count>0){
        setWorking(true);
        setTimeout(getStatus,2000);
      }else{
        restClient.get("https://api.github.com/repos/benidxd5/benidxd5.github.io/actions/runs?status=queued")
        .then((response) => response.data)
        .then((data)=>{
          console.log(data)
          if(data.total_count>0){
            setWorking(true);
            setTimeout(getStatus,2000);
          }else{
            if(!initialCall){
              setWorking(false);
              window.location.reload();
            }
          }
        })
      }
    })
  };

  function getSelectedPaths(){
    let paths = [];
    for(let selpack of selectedPackages){
      for(let ver of selpack.versions){
        paths.push(selpack.paths[selpack.versions.indexOf(ver)]);
      }
    }
    return paths;
  }
  
  function getSelectedIdentifiers(){
    let ids = [];
    for(let selpack of selectedPackages){
      if(ids.indexOf(selpack.identifier)===-1){
        ids.push(selpack.identifier);
      }
    }
    return ids;
  }

  //triggering github workflow

  function handleAddPkgs(){
    restClient.get("http://localhost:1337/api/token")
    .then(response => response.data)
    .then(data => {
      if(data.length>0){
        restClient.post("https://api.github.com/repos/benidxd5/benidxd5.github.io/dispatches",{"event_type": "pkgadd", "client_payload":{"pkgPaths":getSelectedPaths().toString()}},{"Authorization": `token ${data}`})
      }
    })
  }

  function handleRemovePkgs(){
    restClient.get("http://localhost:1337/api/token")
    .then(response => response.data)
    .then(data => {
      if(data.length>0){
        restClient.post("https://api.github.com/repos/benidxd5/benidxd5.github.io/dispatches",{"event_type": "pkgrem", "client_payload":{"pkgPaths":getSelectedPaths().toString(), "pkgIdentifiers": getSelectedIdentifiers().toString()}},{"Authorization": `token ${data}`})
      }
    })
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
          <Button className='btnChangeList' disabled={working} style={{justifySelf: "right", backgroundColor: selectedPage=="AP"?"#b49bc5":"transparent"}} onClick={()=>{handleListChange();setSelectedPage("AP")}}>Approved</Button>
          <Button className='btnChangeList' disabled={working} style={{justifySelf: "left", backgroundColor: selectedPage=="AV"?"#b49bc5":"transparent"}} onClick={()=>{handleListChange();setSelectedPage("AV")}}>Available</Button>
        </div>
      </div>
      <div id='pageSlider' style={{position: "relative",left: selectedPage=="AP"?"0%":"-100%"}}>
        <PackageList packages={searchedPackagesAP} selectedPackages={selectedPackages} setSelectedPackages={setSelectedPackages} multiVersionSelect={true} working={working} workingHeader={"Repository working"} workingText={"This might take a few minutes..."}></PackageList>
        <PackageList packages={data?.packages?.data} selectedPackages={selectedPackages} setSelectedPackages={setSelectedPackages} onLoadMore={handleLoadMore} multiVersionSelect={true} working={working} workingHeader={"Repository working"} workingText={"This might take a few minutes..."}></PackageList>
      </div>
      <div id='divSubmit'>
        <button id='btnSubmit' disabled={working} onClick={handleBtnSubmit}>{selectedPage == "AV" ? "Add Selected" : "Remove Selected"}</button>
      </div>
    </div>
  );
}
