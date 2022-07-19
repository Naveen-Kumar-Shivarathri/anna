import { useRecoilState, useRecoilValue } from "recoil";
import { annotationLayers } from "./AnnotationLayers";



export function Metrics(){

    const annlayers = useRecoilValue(annotationLayers);
    return <div><p>{JSON.stringify(annlayers)}</p></div>;
    
}