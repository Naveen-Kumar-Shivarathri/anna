import { CurrentStack } from "./CurrentStack";
import { annotationLayers } from "./AnnotationLayers";
import React from 'react'

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ImageStack } from "./ImageStack";
import { Metrics } from "./Metrics";
import { AnnotationLayer } from "./AnnotationLayer";
import { selectedLayersIndices, annotationLayersMap } from "./AnnotationLayers";





export default function WhiteBoard({stackInformation}){
  const [currentStack,setCurrentStack] = useRecoilState(CurrentStack);
  const annLayers = useRecoilValue(annotationLayers);
  const selectedLayers = useRecoilValue(selectedLayersIndices);
  const [layersMap,setLayersMap] = useRecoilState(annotationLayersMap);
  
  const layerProps = [];
  if(selectedLayers[0]!=-1&&selectedLayers[0]!=undefined){
    layerProps.push({...annLayers[selectedLayers[0]],index:selectedLayers[0]});
    
  }
  return (<>
  <ImageStack imageStack={stackInformation[currentStack]} />
  <AnnotationLayer dim={layerProps[0]} />
  <Metrics />
  </>);

}
