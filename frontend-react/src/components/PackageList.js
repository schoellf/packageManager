export default function PackageList({packages}){
  return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {searchedPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="package-card"
            style={{ flex: '0 0 170px', margin: '20px' }}
          >
            <div
              className="packagePicture"
              style={{ float: 'left', marginRight: '10px' }}
            >
              <img src={pkg.attributes.packagePic} />
            </div>
            <div className="packageName">
              <h2>{pkg.attributes.packageName}</h2>
            </div>
            <small>{pkg.attributes.packageSize + "kb"}</small>
            <input type="checkbox" style={{ float: 'right' }} onChange={handleCheckedOrUncheckedPackage}/>
          </div>
        ))}
      </div>
  );
}