import { annotationLayers, annotationLayersMap, selectedLayersIndices, labels } from "./AnnotationLayers";
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect } from "react";


export function LayerDetails() {

    const [annLayersList, setAnnLayersList] = useRecoilState(annotationLayers);
    const [annLayersMap, setAnnLayersMap] = useRecoilState(annotationLayersMap);
    const selectedIndex = useRecoilValue(selectedLayersIndices);
    const [labelsList, setLabelsList] = useRecoilState(labels);
    const labelCSSClass = "label";
    const layerInfo = { x: 0, y: 0, width: 0, height: 0, layer: '', label: '' };


    if (selectedIndex[0] != -1) {
        layerInfo.x = annLayersList[selectedIndex[0]].x;
        layerInfo.y = annLayersList[selectedIndex[0]].y;
        layerInfo.width = annLayersList[selectedIndex[0]].width;
        layerInfo.height = annLayersList[selectedIndex[0]].height;
        layerInfo.layer = annLayersMap[selectedIndex[0]].layer;
        layerInfo.label = annLayersMap[selectedIndex[0]].label;
    }

    const handleXChange = (event) => {
        if (selectedIndex[0] != -1) {
            const layersCopy = JSON.parse(JSON.stringify(annLayersList));
            const value = parseInt(event.target.value);
            const shape = {...layersCopy[selectedIndex[0]],x:value};
            setAnnLayersList((prev) => [...layersCopy.splice(0, selectedIndex[0]), shape, ...layersCopy.splice(selectedIndex[0] + 1, layersCopy.length)]);
        }
    }

    const handleYChange = (event) => {
        if (selectedIndex[0] != -1) {
            const layersCopy = JSON.parse(JSON.stringify(annLayersList));
            const value = parseInt(event.target.value);
            const shape = {...layersCopy[selectedIndex[0]],y:value};
            setAnnLayersList((prev) => [...layersCopy.splice(0, selectedIndex[0]), shape, ...layersCopy.splice(selectedIndex[0] + 1, layersCopy.length)]);
        }

    }

    const handleWidth = (event) => {
        if (selectedIndex[0] != -1) {
            const layersCopy = JSON.parse(JSON.stringify(annLayersList));
            const value = parseInt(event.target.value);
            const shape = {...layersCopy[selectedIndex[0]],width:value};
            setAnnLayersList((prev) => [...layersCopy.splice(0, selectedIndex[0]), shape, ...layersCopy.splice(selectedIndex[0] + 1, layersCopy.length)]);
        }
    }

    const handleHeight = (event) => {
        if (selectedIndex[0] != -1) {
            const layersCopy = JSON.parse(JSON.stringify(annLayersList));
            const value = parseInt(event.target.value);
            const shape = {...layersCopy[selectedIndex[0]],height:value};
            setAnnLayersList((prev) => [...layersCopy.splice(0, selectedIndex[0]), shape, ...layersCopy.splice(selectedIndex[0] + 1, layersCopy.length)]);
        }
    }

    const handleLayerId = (event) => {
        if (selectedIndex[0] != -1) {
            const mapCopy = JSON.parse(JSON.stringify(annLayersMap));
            
            
            const layerIdentities = {...annLayersMap[selectedIndex[0]],layer:event.target.value};
            setAnnLayersMap((prev) => [...mapCopy.splice(0, selectedIndex[0]), layerIdentities, ...mapCopy.splice(selectedIndex[0] + 1, mapCopy.length)]);
        }
    }

    const handleLabelName = (event) => {
        if (selectedIndex[0] != -1) {
            const mapCopy = JSON.parse(JSON.stringify(annLayersMap));
            const layerIdentities = {...annLayersMap[selectedIndex[0]],label:event.target.value};
            setAnnLayersMap((prev) => [...mapCopy.splice(0, selectedIndex[0]), layerIdentities, ...mapCopy.splice(selectedIndex[0] + 1, mapCopy.length)]);
            
        }
    }


    return <>
        <div className="layerDetails">
            <table>
                <tbody>
                    <tr>
                        <td>
                            <label className={labelCSSClass}>X:</label></td>
                        <td>
                            <input className="inputField xAxis" type="number" value={layerInfo.x} onChange={handleXChange} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <label className={labelCSSClass}>Y:</label></td><td>
                            <input className="inputField  yAxis" type="number" value={layerInfo.y} onChange={handleYChange} /></td></tr>
                    <tr>
                        <td>
                            <label className={labelCSSClass}>Width:</label></td><td>
                            <input className="inputField label width" type="number" value={layerInfo.width} onChange={handleWidth} /></td></tr>
                    <tr>
                        <td>
                            <label className={labelCSSClass}>Height:</label></td><td>
                            <input className="inputField label height" type="number" value={layerInfo.height} onChange={handleHeight} /></td></tr>
                    <tr>
                        <td>
                            <label className={labelCSSClass}>LayerID:</label></td><td>
                            <input className="inputField label layerId" type="text" value={layerInfo.layer} onChange={handleLayerId} /></td></tr>
                    <tr>
                        <td>
                            <label className={labelCSSClass}>Label:</label></td><td>
                            <input className="inputField label labelName" type="text" value={layerInfo.label} onChange={handleLabelName} /></td></tr>
                </tbody>
            </table>
        </div>
    </>

}
