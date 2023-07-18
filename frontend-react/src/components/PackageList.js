import "./PackageList.css"
import imagePath from "../pics/info.png"
import { useState } from "react";

export default function PackageList({packages, selectedPaths, setSelectedPaths, onLoadMore}){

  const [openedDescr, setOpenedDescr] = useState(undefined);
 

  function handleCheckedOrUncheckedPackage(e, pkg) {
    console.log("handle")
    if(e.target.checked) {
      //add to post request
      setSelectedPaths([...selectedPaths, pkg.attributes.versions[Object.keys(pkg.attributes.versions)[0]]])
    }
    else {
      //remove from post request
      let newSelectedPaths = [...selectedPaths];
      newSelectedPaths.splice(newSelectedPaths.indexOf(pkg.attributes.versions[Object.keys(pkg.attributes.versions)[0]]), 1);
      setSelectedPaths([...newSelectedPaths])
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
          {pkg.id !== openedDescr && <i style={{ fontSize: '20px' }} class="bi bi-question"></i>}
          {pkg.id === openedDescr && <p className="descriptionTag">{pkg.attributes.description}</p>}
        </div>

        <div className="packageName">
          <h2>{pkg.attributes.name}</h2>
        </div>
        <small>{pkg.attributes.url}</small>
        <input type="checkbox" style={{ float: 'right' }} onChange={e => {handleCheckedOrUncheckedPackage(e, pkg)}} checked={selectedPaths.indexOf(pkg.attributes.versions[Object.keys(pkg.attributes.versions)[0]])!=-1}/>
      </div>
    ))}
    
      {onLoadMore && <button style={{margin: "20px", width: "150px", height: "80px"}} onClick={()=>{if(onLoadMore){onLoadMore()}}}>Load More</button>}
    </div>
  );
}