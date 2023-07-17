import "./PackageList.css"

export default function PackageList({packages, selectedPaths, setSelectedPaths}){
 
  function handleCheckedOrUncheckedPackage(e, pkg) {

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


  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', height: "fit-content" }}>
    {packages?.map((pkg) => (
      <div
        key={pkg.id}
        className="package-card"
        style={{ flex: '0 0 170px', margin: '20px' }}
      >
        <div
          className="packageDescr"
          style={{ float: 'left', marginRight: '10px' }}
        >
          <img src={pkg.attributes.pic} />
        </div>
        <div className="packageName">
          <h2>{pkg.attributes.name}</h2>
        </div>
        <small>{pkg.attributes.url}</small>
        <input type="checkbox" style={{ float: 'right' }} onChange={e => {handleCheckedOrUncheckedPackage(e, pkg)}}/>
      </div>
    ))}
    </div>
  );
}