
export function AnnotationLayer({dim}){

    const styleProp = {
        position:"absolute",
        left: dim.x+'px',
        top: dim.y+'px',
        height:dim.height+'px',
        width:dim.width+'px',
        borderStyle:"solid"
    }

    return <>
    <div>
        <div style={styleProp} >

        </div>
        
    </div>
    </>;

}