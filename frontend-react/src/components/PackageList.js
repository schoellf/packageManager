import "./PackageList.css"
import { useState } from "react";

export default function PackageList({packages, selectedPackages, setSelectedPackages, onLoadMore}){

  const [openedDescr, setOpenedDescr] = useState(undefined);
  const [openedVersions, setOpenedVersions] = useState(undefined);

  function handleCheckedOrUncheckedPackage(e, pkg) {
    console.log("handle")
    if(e.target.checked) {
      //add to post request
      if(Object.keys(pkg.attributes.versions).length>1){
        setOpenedVersions(pkg.id)
      }else{
        setSelectedPackages([...selectedPackages, pkg.attributes.versions[Object.keys(pkg.attributes.versions)[0]]])
      }
    }
    else {
      //remove from post request
      let newSeletedPackages = [...selectedPackages];
      newSeletedPackages.splice(newSeletedPackages.indexOf(pkg.attributes.versions[Object.keys(pkg.attributes.versions)[0]]), 1);
      setSelectedPackages([...newSeletedPackages])
    }
  }


  function handleOpenDescr(identifier) {
    setOpenedDescr(identifier);
  }

  function handleCloseDescr() {
    setOpenedDescr(undefined);
  }


  return (
    <div className="listPkgs" style={{ display: 'flex', flexWrap: 'wrap', height: "fit-content", maxHeight: "100%", overflow:"auto"}}>
    {packages?.map((pkg) => (
      <div
        key={pkg.id}
        className="package-card"
        style={{ flex: '0 0 150px', margin: '20px' }}
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

        <div style={{marginLeft: pkg.id == openedVersions ? "0%": "100%",position: "absolute", top:0, right: 0 ,width: pkg.id == openedVersions ? '100%' : '0%', height: '100%', zIndex: pkg.id == openedVersions ? '10' : '1', backgroundColor: pkg.id == openedVersions ? 'green' : '#8e2ad6', transition: "1s" }}>
          
        </div>

        <div className="packageName">
          <h2>{pkg.attributes.name}</h2>
        </div>
        <small>{pkg.attributes.url}</small>
        <input type="checkbox" style={{ float: 'right' }} onChange={e => {handleCheckedOrUncheckedPackage(e, pkg)}} checked={selectedPackages.indexOf(pkg.attributes.versions[Object.keys(pkg.attributes.versions)[0]])!=-1}/>
      </div>
    ))}
    
      {onLoadMore && <button style={{margin: "20px", width: "150px", height: "80px"}} onClick={()=>{if(onLoadMore){onLoadMore()}}}>Load More</button>}
    </div>
  );
}