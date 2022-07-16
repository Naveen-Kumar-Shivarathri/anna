import { CurrentStack } from "./CurrentStack";
import { annotationLayers } from "./AnnotationLayers";
import React from 'react'

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ImageStack } from "./ImageStack";
import { Metrics } from "./Metrics";
import { AnnotationLayer } from "./AnnotationLayer";
import { selectedLayersIndices } from "./AnnotationLayers";





export default function WhiteBoard({stackInformation}){
  const [currentStack,setCurrentStack] = useRecoilState(CurrentStack);
  const annLayers = useRecoilValue(annotationLayers);
  const selectedLayers = useRecoilValue(selectedLayersIndices);
  
  const layerProps = [];
  if(selectedLayers[0]!=-1&&selectedLayers[0]!=undefined){
    console.log(selectedLayers[0]);
    layerProps.push(annLayers[selectedLayers[0]]);
    
  }
  console.log(layerProps);
  return (<>
  <ImageStack imageStack={stackInformation[currentStack]} />
  {layerProps.map((layer,id)=>
    <AnnotationLayer key={id} dim={annLayers[layer]}/>)}
  <Metrics />
  </>);

}
