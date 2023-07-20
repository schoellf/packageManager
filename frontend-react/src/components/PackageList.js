import "./PackageList.css"
import { useState } from "react";

export default function PackageList({packages, selectedPackages, setSelectedPackages, onLoadMore, multiVersionSelect}){

  const [openedDescr, setOpenedDescr] = useState(undefined);
  const [openedVersions, setOpenedVersions] = useState(undefined);
  const [selectedVersions, setSelectedVersions] = useState([]);
  const [openedSideBar, setOpenedSideBar] = useState(undefined);

  function handleCheckedOrUncheckedPackage(e, pkg) {
    if(!selectedPackages.find(p=>p.identifier===pkg.attributes.identifier)) {
      //add to post request
      if(Object.keys(pkg.attributes.versions).length>1){
        handleOpenVersions(pkg.id);
      }else{
        setSelectedPackages([...selectedPackages, 
          {
            name: pkg.attributes.name,
            identifier: pkg.attributes.identifier, 
            versions: [Object.keys(pkg.attributes.versions)[0]],
            paths: [pkg.attributes.versions[Object.keys(pkg.attributes.versions)[0]]]
          }
        ]);

        handleCloseVersions();
      }
      e.stopPropagation();
    }
    else {
      //remove from post request
      let newSeletedPackages = [...selectedPackages];
      newSeletedPackages.splice(newSeletedPackages.indexOf(newSeletedPackages.find(p=>p.identifier===pkg.attributes.identifier)), 1);
      setSelectedPackages([...newSeletedPackages])
    }
  }

  function handleVersionsSelected(e, pkg,v){
    let versions = selectedVersions;

    if(versions.length>0||!multiVersionSelect){
      if(multiVersionSelect){
        let paths = [];
        for(let v of versions){
          paths.push(pkg.attributes.versions[v.toString()])
        }
        setSelectedPackages([...selectedPackages, 
          {
            name: pkg.attributes.name,
            identifier: pkg.attributes.identifier, 
            versions:[...versions],
            paths: [...paths]
          }
        ]);  
      }else{
        setSelectedPackages([...selectedPackages, 
          {
            name: pkg.attributes.name,
            identifier: pkg.attributes.identifier, 
            versions:[v],
            paths: [pkg.attributes.versions[v.toString()]]
          }
        ]);  
      }
      setSelectedVersions([]);
    }

    handleCloseVersions();

    e.stopPropagation();
  }

  function handleVersionSelect(e,pkg,version){

    if(multiVersionSelect){
      let vIndex = selectedVersions.indexOf(version);
      if(vIndex ===-1){
        setSelectedVersions([...selectedVersions,version]);
      }else{
        let newSelV = [...selectedVersions];
        newSelV.splice(vIndex,1);
        setSelectedVersions([...newSelV]);
      }
    }else{
      handleVersionsSelected(e,pkg,version);
    }
    
    e.stopPropagation();

  }

  function handleOpenDescr(e,identifier) {
    setOpenedDescr(identifier);
    setOpenedVersions(undefined);
    e.stopPropagation();
  }

  function handleCloseDescr() {
    setOpenedDescr(undefined);
  }

  
  function handleOpenVersions(identifier) {
    setOpenedVersions(identifier);
  }

  function handleCloseVersions() {
    setOpenedVersions(undefined);
    setSelectedVersions([]);
  }

  function handleClickSideArrow() {
    if(openedSideBar == undefined || openedSideBar == false) {
      setOpenedSideBar(true);
    }
    else {
      if(openedSideBar == true) {
        setOpenedSideBar(false);
      }
    }
  }


  return (
    <div className="listPkgs" style={{ display: 'flex', flexWrap: 'wrap', height: "100%", maxHeight: "100%", overflow: "auto" }}>
        <div onClick={handleClickSideArrow} className="sideBarArrow">
          <i class="bi bi-arrow-right"></i>
        </div>
      <div className="listSideBar" style={{ left: openedSideBar == true ? '2%' : '-250px'}}>
        <ul className="slideList">
          {selectedPackages?.map((pkg) => (
            <li key={pkg.name}>
              {pkg.name}
              <ul>
                {pkg?.versions.map((version) => (
                  <li key={version}>{version}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      {packages?.map((pkg) => (
        <div
          key={pkg.id}
          className="package-card"
          onClick={(e) => handleCheckedOrUncheckedPackage(e, pkg)}
        style={{backgroundColor: (selectedPackages.find(p=>p.identifier==pkg.attributes.identifier))?"#e3c3fa":"white", flex: '0 0 150px', margin: '20px' }}      
      >
        <div style={{ width: pkg.id == openedDescr ? '150%' : '20px', height: pkg.id == openedDescr ? '250%' : '20px', zIndex: pkg.id == openedDescr ? '10' : '1', backgroundColor: pkg.id == openedDescr ? 'white' : '#8e2ad6' }} onClick={(e) => handleOpenDescr(e,pkg.id)} onMouseLeave={handleCloseDescr} className="packageDescr">
          {pkg.id !== openedDescr && <i style={{ fontSize: '20px' }} className="bi bi-question"></i>}
          {pkg.id === openedDescr && <p className="descriptionTag">{<span>
            <b>{pkg.attributes.name}</b><br></br>
            <i>Versions:</i>
            <ul className="listVersions">
              {Object.keys(pkg.attributes.versions).map(v=><li key={pkg.id + v.toString()}>{v}</li>)}
            </ul>
            <br></br>
            <i>Description:</i>
            <br></br>
            {pkg.attributes.description}
            </span>}</p>}
        </div>

        <div className="versionCard" onMouseLeave={handleCloseVersions} style={{marginLeft: pkg.id == openedVersions ? "0%": "100%",width: pkg.id == openedVersions ? '100%' : '0%', height: '100%', backgroundColor: pkg.id == openedVersions ? 'white' : '#8e2ad6', border: pkg.id == openedVersions ? 'thin solid #8e2ad6' : 'none'}}>
            {multiVersionSelect && <i class={selectedVersions.length>0?"bi bi-check-square":"bi bi-x-square"} onClick={(e)=>handleVersionsSelected(e,pkg)} style={{position: "absolute", top:"5%", right:"5%", width: "fit-content"}}></i>}          
            <ul className="versionCardList" style={{marginRight: multiVersionSelect?"15%":"0%"}}>
            {Object.keys(pkg.attributes.versions).map(v=><li key={pkg.id + v.toString()} style={{backgroundColor:selectedVersions.indexOf(v)===-1?"lightgray":"#8e2ad6"}} onClick={(e)=>handleVersionSelect(e,pkg,v)}>{v}</li>)}
          </ul>
        </div>

        <div className="packageName">
          <h2>{pkg.attributes.name}</h2>
        </div>
        <small>{selectedPackages.find(p=>p.identifier===pkg.attributes.identifier)?.versions.map(v=><span>{v}<br></br></span>)}</small>
        
      </div>
    ))}
          {onLoadMore && <button style={{margin: "20px", width: "150px", height: "80px"}} onClick={()=>{if(onLoadMore){onLoadMore()}}}>Load More</button>}
    </div>
  );
}