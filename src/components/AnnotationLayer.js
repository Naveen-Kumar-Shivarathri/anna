import { annotationLayersMap,labels } from "./AnnotationLayers";
import { useRecoilState, useRecoilValue } from "recoil";

export function AnnotationLayer({dim}){

    const [layersMap,setLayersMap] = useRecoilState(annotationLayersMap);
    const predefinedLabelList = useRecoilValue(labels);
    const labelList = [...predefinedLabelList];
    if(dim==undefined)
    {
        return <></>;
    }
    const styleProp = {
        position:"absolute",
        left: dim.x+'px',
        top: dim.y+dim.height+'px'
    }

    for(let layer of layersMap){

        if(layer.label!=''&&layer.label!=undefined){
            let found = false;
            for(let label of labelList){
                if(label==layer.label)
                    {
                        found = true;
                        break;
                    }
            }
            if(!found)
                labelList.push(layer.label);
        }
    }

    if(layersMap[dim.index]==undefined){
        return <></>;
    }
    

    const handleSelectChange = (event)=>{
        const layersMapCopy = JSON.parse(JSON.stringify(layersMap));
        setLayersMap((prevMap)=>[...layersMapCopy.slice(0,dim.index),{...layersMapCopy[dim.index],label:event.target.value},...layersMapCopy.splice(dim.index+1,layersMapCopy.length)]);
    }

    return <>
    <div>
        <div style={styleProp} >
           <select className="labelSelect" value={layersMap[dim.index].label} onChange={handleSelectChange}>
            {labelList.map(item=><option key = {item} value={item}>{item}</option>)}
           </select>
        </div> 
    </div>
    </>;

}