import "./BusyIndicator.css"

export default function BusyIndicator({header, text, timeRemaining}){
    return (<div className='divBusy'>
                <div className='divBusyText'>
                    <h2>{header}</h2>
                    <p>{text}</p>
                    {timeRemaining && <p>Estimate: {timeRemaining} Seconds</p>}
                </div>
            </div>)
}