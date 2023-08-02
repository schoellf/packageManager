import BusyIndicator from "./BusyIndicator";
import "./PackageList.css"
import { useState } from "react";

export default function PackageList({packages, selectedPackages, setSelectedPackages, onLoadMore, multiVersionSelect, working, workingHeader, workingText, timeRemaining}){

  const [openedDescr, setOpenedDescr] = useState(undefined);
  const [openedVersions, setOpenedVersions] = useState(undefined);
  const [selectedVersions, setSelectedVersions] = useState([]);
  const [openedSideBar, setOpenedSideBar] = useState(false);

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
    if(!openedSideBar) {
      setOpenedSideBar(true);
    }
    else {
        setOpenedSideBar(false);
    }
  }

  function handleRemoveSelected (e, pkg, version) {
    //let pkgToChange = selectedPackages.find(p => pkg.identifier == p.identifier);

    if(pkg.versions.length > 1) {
      let newVersions = [...pkg.versions];
      let clonedSelectedPackages = [...selectedPackages];

      newVersions.splice(newVersions.indexOf(version), 1);
      clonedSelectedPackages[selectedPackages.indexOf(pkg)].versions = newVersions;
      setSelectedPackages([...clonedSelectedPackages]);
    }
    else {
      let clonedSelectedPackages = [...selectedPackages];
      
      clonedSelectedPackages.splice(clonedSelectedPackages.indexOf(pkg), 1);
      setSelectedPackages([...clonedSelectedPackages]);  
    }
  }

  //function to sort versions correctly
  function compareVersions(versionA, versionB) {
    const a = versionA.split('.').map(Number);
    const b = versionB.split('.').map(Number);
  
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      if (a[i] === undefined) return -1; 
      if (b[i] === undefined) return 1; 
  
      if (a[i] > b[i]) return -1;
      if (a[i] < b[i]) return 1;       
    }
    return 0;
  }



  return (
    <div className="pkgListMainContainer">
      {working && <BusyIndicator header={workingHeader||"Busy"} text={workingText||""} timeRemaining={timeRemaining}></BusyIndicator>}
      <div className="listSideBar" style={{ left: openedSideBar ? '0' : '-255px' }}>
        <div onClick={handleClickSideArrow} className="sideBarArrow">
          <i className={openedSideBar ? "bi bi-arrow-left" : "bi bi-arrow-right"}></i>
          <div className="selNumInfo">{selectedPackages?.length || 0}</div>
        </div>
        <h2>Selected Packages</h2>
        <ul className="slideList">
          {selectedPackages?.map((pkg) => (
            <li key={pkg.name}>
              {pkg.name}
              <ul>
                {pkg?.versions.map((version) => (
                  <li onClick={(e) => handleRemoveSelected(e, pkg, version)} className="slideListVersions" key={version}>{version}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <ul className="listPkgs">
        {packages?.map((pkg) => (
          <div
            key={pkg.id}
            className="package-card"
            onClick={(e) => handleCheckedOrUncheckedPackage(e, pkg)}
            style={{ backgroundColor: (selectedPackages.find(p => p.identifier == pkg.attributes.identifier)) ? "#e3c3fa" : "white"}}
          >
            <div key={pkg.id} style={{ width: pkg.id == openedDescr ? '150%' : '20px', height: pkg.id == openedDescr ? '250%' : '20px', zIndex: pkg.id == openedDescr ? '10' : '1', backgroundColor: pkg.id == openedDescr ? 'white' : '#8e2ad6' }} onClick={(e) => handleOpenDescr(e, pkg.id)} onMouseLeave={handleCloseDescr} className="packageDescr">
              {pkg.id !== openedDescr && <i style={{ fontSize: '20px' }} className="bi bi-question"></i>}
              {pkg.id === openedDescr && <p className="descriptionTag">{<span>
                <b>{pkg.attributes.name}</b><br></br>
                <i>Versions:</i>
                <ul className="listVersions">
                  {Object.keys(pkg.attributes.versions).sort(compareVersions).map(v => <li key={pkg.id + v.toString()}>{v}</li>)}
                </ul>
                <br></br>
                <i>Description:</i>
                <br></br>
                {pkg.attributes.description}
              </span>}</p>}
            </div>

            <div key={pkg.id+"versions"} className="versionCard" onMouseLeave={handleCloseVersions} style={{ marginLeft: pkg.id == openedVersions ? "0%" : "100%", width: pkg.id == openedVersions ? '100%' : '0%', height: '100%', backgroundColor: pkg.id == openedVersions ? 'white' : '#8e2ad6', border: pkg.id == openedVersions ? 'thin solid #8e2ad6' : 'none' }}>
              {multiVersionSelect && <i className={selectedVersions.length > 0 ? "bi bi-check-square" : "bi bi-x-square"} onClick={(e) => handleVersionsSelected(e, pkg)} style={{ position: "absolute", top: "5%", right: "5%", width: "fit-content" }}></i>}
              <ul className="versionCardList" style={{ marginRight: multiVersionSelect ? "15%" : "0%" }}>
                {Object.keys(pkg.attributes.versions).sort(compareVersions).map(v => <li key={pkg.id + v.toString()} style={{ backgroundColor: selectedVersions.indexOf(v) === -1 ? "lightgray" : "#8e2ad6" }} onClick={(e) => handleVersionSelect(e, pkg, v)}>{v}</li>)}
                </ul>
            </div>

            <div className="packageName">
              <h2>{pkg.attributes.name}</h2>
            </div>
            <small>{selectedPackages.find(p => p.identifier === pkg.attributes.identifier)?.versions.map(v => <span>{v}<br></br></span>)}</small>

          </div>
        ))}
        {onLoadMore && <button className="loadMore" onClick={() => { if (onLoadMore) { onLoadMore() } }}>Load More</button>}
      </ul>
    </div>
  );
}