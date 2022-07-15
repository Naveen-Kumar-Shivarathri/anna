import { CurrentStack } from "./CurrentStack";

import React from 'react'

import { useRecoilState, useSetRecoilState } from "recoil";
import { CanvasElement } from "./CanvasElement";
import { Metrics } from "./Metrics";





export default function WhiteBoard({stackInformation}){
  const [currentStack,setCurrentStack] = useRecoilState(CurrentStack);
  return (<>
  <CanvasElement imageStack={stackInformation[currentStack]} />
  <Metrics />
  </>);

}
