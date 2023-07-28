import "./BusyIndicator.css"

export default function BusyIndicator({header, text}){
    return (<div className='divBusy'>
                <div className='divBusyText'>
                    <h2>{header}</h2>
                    <p1>{text}</p1>
                </div>
            </div>)
}