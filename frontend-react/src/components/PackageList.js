import "./PackageList.css"
import { useState } from "react";

export default function PackageList({packages, selectedPackages, setSelectedPackages, onLoadMore}){

  const [openedDescr, setOpenedDescr] = useState(undefined);
  const [openedVersions, setOpenedVersions] = useState(undefined);

  function handleCheckedOrUncheckedPackage(_e, pkg) {
    if(!selectedPackages.find(p=>p.identifier===pkg.attributes.identifier)) {
      //add to post request
      if(Object.keys(pkg.attributes.versions).length>1){
        handleOpenVersions(pkg.id)
      }else{
        setSelectedPackages([...selectedPackages, 
          {
            identifier: pkg.attributes.identifier, 
            version: Object.keys(pkg.attributes.versions)[0],
            path: pkg.attributes.versions[Object.keys(pkg.attributes.versions)[0]]
          }
        ]);

        handleCloseVersions();
      }
    }
    else {
      //remove from post request
      let newSeletedPackages = [...selectedPackages];
      newSeletedPackages.splice(newSeletedPackages.indexOf(newSeletedPackages.find(p=>p.identifier===pkg.attributes.identifier)), 1);
      setSelectedPackages([...newSeletedPackages])
    }
  }

  function handleVersionSelect(e, pkg, version){
    console.log("versionselj")
    setSelectedPackages([...selectedPackages, 
      {
        identifier: pkg.attributes.identifier, 
        version: version.toString(),
        path: pkg.attributes.versions[version.toString()]
      }
    ]);

    handleCloseVersions();

    e.stopPropagation();
  }


  function handleOpenDescr(identifier) {
    setOpenedDescr(identifier);
    setOpenedVersions(undefined);
  }

  function handleCloseDescr() {
    setOpenedDescr(undefined);
  }

  
  function handleOpenVersions(identifier) {
    setOpenedVersions(identifier);
  }

  function handleCloseVersions() {
    setOpenedVersions(undefined);
  }


  return (
    <div className="listPkgs" style={{ display: 'flex', flexWrap: 'wrap', height: "fit-content", maxHeight: "100%", overflow:"auto"}}>
    {packages?.map((pkg) => (
      <div
        key={pkg.id}
        className="package-card"
        onClick={(e) => handleCheckedOrUncheckedPackage(e, pkg)}
        style={{backgroundColor: (selectedPackages.find(p=>p.identifier==pkg.attributes.identifier))?"cyan":"white", flex: '0 0 150px', margin: '20px' }}      
      >
        <div style={{ width: pkg.id == openedDescr ? '150%' : '20px', height: pkg.id == openedDescr ? '250%' : '20px', zIndex: pkg.id == openedDescr ? '10' : '1', backgroundColor: pkg.id == openedDescr ? 'white' : '#8e2ad6' }} onClick={() => handleOpenDescr(pkg.id)} onMouseLeave={handleCloseDescr} className="packageDescr">
          {pkg.id !== openedDescr && <i style={{ fontSize: '20px' }} className="bi bi-question"></i>}
          {pkg.id === openedDescr && <p className="descriptionTag">{<span>
            <b>{pkg.attributes.name}</b><br></br>
            <i>Versions:</i>
            <ul className="listVersions">
              {Object.keys(pkg.attributes.versions).map(v=><li>{v}</li>)}
            </ul>
            <br></br>
            <i>Description:</i>
            <br></br>
            {pkg.attributes.description}
            </span>}</p>}
        </div>

        <div className="versionCard" onMouseLeave={handleCloseVersions} style={{marginLeft: pkg.id == openedVersions ? "0%": "100%",width: pkg.id == openedVersions ? '100%' : '0%', height: '100%', backgroundColor: pkg.id == openedVersions ? 'white' : '#8e2ad6', border: pkg.id == openedVersions ? 'thin solid #8e2ad6' : 'none'}}>
          <ul className="versionCardList">
            {Object.keys(pkg.attributes.versions).map(v=><li onClick={(e)=>handleVersionSelect(e,pkg,v)}>{v}</li>)}
          </ul>
        </div>

        <div className="packageName">
          <h2>{pkg.attributes.name}</h2>
        </div>
        <small>{selectedPackages.find(p=>p.identifier===pkg.attributes.identifier)?.version||""}</small>
        <input type="checkbox" style={{ float: 'right' }} checked={selectedPackages.find(p=>p.identifier===pkg.attributes.identifier)}/>
      </div>
    ))}
    
      {onLoadMore && <button style={{margin: "20px", width: "150px", height: "80px"}} onClick={()=>{if(onLoadMore){onLoadMore()}}}>Load More</button>}
    </div>
  );
}