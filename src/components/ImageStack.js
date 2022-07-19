import React, { useEffect, useState ,useRef} from 'react';

import { atom, useRecoilState } from 'recoil';
import { annotationLayers,annotationLayersMap, selectedLayersIndices } from './AnnotationLayers';

export function ImageStack({imageStack}){

    const [annLayers, setAnnLayer] = useRecoilState(annotationLayers);

    const [annLayerMap, setAnnLayersMap] = useRecoilState(annotationLayersMap);

    const [selectedAnnLayersIndices, setSelectedAnnLayersIndices] = useRecoilState(selectedLayersIndices);

    const currentShapes = useRef([]);

    const newShape = useRef({});

    const hightLightedLayers = useRef([]);

    const selectedLayers = useRef([]);

    const pinnedCoordiantes = useRef({x:0,y:0});

    const pinnedShapeHandles = useRef({x:0,y:0});

    const isDragging = useRef(false);

    const isShapeSelected = useRef(false);

    const isResizable = useRef(false);

    const canvasRef = useRef(null);

    const canvasContext = useRef(null);

    const selectedShapeIndices = useRef([]);

    const selectedShapeColor = 'red';

    const highlightColor = 'green';

    const imageDimensions = useRef({height:0,width:0});

    const boundarySelection = useRef({
        left:false,
        right:false,
        top:false,
        bottom:false
    });



    useEffect(()=>{
        const canvas = canvasRef.current;
        canvas.width = imageStack.width;
        canvas.height = imageStack.height;
        canvasContext.current = canvas.getContext("2d");
        canvas.style.border = "solid 1px red";
        draw_shapes();

    },[]);

    const draw_shapes = () =>{
        const context = canvasContext.current;
        context.clearRect(0, 0,imageStack.width, imageStack.height);
        context.drawImage(imageStack.imageSource, 0, 0);
        const drawableShapes = [...currentShapes.current,...hightLightedLayers.current,...selectedLayers.current];
        if(JSON.stringify(newShape.current)!='{}')
            drawableShapes.push(newShape.current);
        for (let shape of drawableShapes) {
            context.strokeStyle = shape.color;
            context.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
    }


    const is_mouse_in_shape = (x, y, shape) =>{
        let shape_left = shape.x-imageStack.annLayerBoundary;
        let shape_right = shape.x + shape.width+imageStack.annLayerBoundary;
        let shape_top = shape.y-imageStack.annLayerBoundary;
        let shape_bottom = shape.y + shape.height+imageStack.annLayerBoundary;
    
        if (x > shape_left && x < shape_right && y > shape_top && y < shape_bottom) {
            return true;
        }
    
        return false;
    
    }

    const is_mouse_on_resizable_boundary = (x,y,shape)=>{

        let left_buffer_regionA = shape.x + imageStack.annLayerBoundary;
        let left_buffer_regionB = shape.x - imageStack.annLayerBoundary;
        let right_buffer_regionA = shape.x + shape.width - imageStack.annLayerBoundary;
        let right_buffer_regionB = shape.x + shape.width + imageStack.annLayerBoundary;
        let top_buffer_regionA = shape.y + imageStack.annLayerBoundary;
        let top_buffer_regionB = shape.y - imageStack.annLayerBoundary;
        let bottom_buffer_regionA = shape.y + shape.height - imageStack.annLayerBoundary;
        let bottom_buffer_regionB = shape.y + shape.height + imageStack.annLayerBoundary;

        let left_boundary_check = (x > left_buffer_regionB && x < left_buffer_regionA)&&(y > getPercentageOf(top_buffer_regionA,shape.height,12.5) && y < getPercentageOf(bottom_buffer_regionA,shape.height,-12.5));
        let right_boundary_check = (x > right_buffer_regionA && x < right_buffer_regionB)&&(y > getPercentageOf(top_buffer_regionA,shape.height,12.5) && y < getPercentageOf(bottom_buffer_regionA,shape.height,-12.5));
        let top_boundary_check = (y > top_buffer_regionB && y < top_buffer_regionA)&&(x > getPercentageOf(left_buffer_regionA,shape.width,12.5) && x < getPercentageOf(right_buffer_regionA,shape.width,-12.5));
        let bottom_boundary_check = ( y > bottom_buffer_regionA && y < bottom_buffer_regionB)&&(x > getPercentageOf(left_buffer_regionA,shape.width,12.5) && x < getPercentageOf(right_buffer_regionA,shape.width,-12.5));

        return {
            left:left_boundary_check,
            right:right_boundary_check,
            top:top_boundary_check,
            bottom:bottom_boundary_check
        };

       
    }

    const getPercentageOf = (coordinate,dimension,percentage)=>{
        if(percentage<1){
            return coordinate+dimension*percentage/100;
        }else{
            return coordinate+dimension*percentage/100;
        }
    }



    const is_mouse_on_shape = (x, y, shape) =>{

        let left_buffer_region = shape.x + imageStack.annLayerBoundary;
        let right_buffer_region = shape.x + shape.width - imageStack.annLayerBoundary;
        let top_buffer_region = shape.y + imageStack.annLayerBoundary;
        let bottom_buffer_region = shape.y + shape.height - imageStack.annLayerBoundary;
    
        if ((is_mouse_in_shape(x, y, shape)) && ((x > shape.x-imageStack.annLayerBoundary && x < left_buffer_region) || (y > shape.y-imageStack.annLayerBoundary && y < top_buffer_region) || (x > right_buffer_region && x < shape.x + shape.width+imageStack.annLayerBoundary) || (y > bottom_buffer_region && y < shape.y + shape.height+imageStack.annLayerBoundary)))
            return true;
    
        return false;
    }

    const mouse_down = (event)=>{

        event.preventDefault();
        pinnedCoordiantes.current.x = event.clientX;
        pinnedCoordiantes.current.y = event.clientY;

        
        selectedShapeIndices.current = [];
        selectedLayers.current = [];

        let shapeIndex = 0;
        let selectedIndex = -1;
        for(let shape of currentShapes.current){
            if(is_mouse_on_shape(event.clientX,event.clientY,shape)){
                selectedShapeIndices.current.push(shapeIndex);
                pinnedShapeHandles.current.x = shape.x;
                pinnedShapeHandles.current.y = shape.y;
                selectedLayers.current.push({...shape,color:selectedShapeColor});
                setSelectedAnnLayersIndices(()=>[shapeIndex]);
                selectedIndex = shapeIndex;
                boundarySelection.current = is_mouse_on_resizable_boundary(event.clientX,event.clientY,shape);
                break;
            }
            shapeIndex++;
        }

        if(selectedIndex!=-1)
            isShapeSelected.current = true;
        else{
            hightLightedLayers.current = [];
            isShapeSelected.current = false;
            setSelectedAnnLayersIndices(()=>[-1]);
        }

        isDragging.current = true; 
        draw_shapes();

    }

    const mouse_up = (event)=>{

        event.preventDefault();
        let selectedIndex = index_of_shape_for_coordinates(event.clientX,event.clientY);

        if(selectedIndex!=-1&&isResizable.current==false)
            isResizable.current = true;
        else
            isResizable.current = false;

        boundarySelection.current={
            left:false,
            right:false,
            top:false,
            bottom:false
        };

        if(isDragging.current){
            if(isShapeSelected.current){
                const indices = selectedShapeIndices.current;
                let selectedIndex=0;
                for(let index of indices){
                    currentShapes.current = [...currentShapes.current.slice(0,index),{...selectedLayers.current[selectedIndex],color:currentShapes.current[index].color},...currentShapes.current.slice(index+1,currentShapes.current.length)];
                    setAnnLayer((prevList)=>[...prevList.slice(0,index),{...selectedLayers.current[selectedIndex],color:currentShapes.current[index].color},...prevList.slice(index+1,prevList.length)]);
                    selectedIndex++;
                }
                
            }
            else{
                finish_dragging();
            }
        }

        isShapeSelected.current = false;
        isDragging.current = false;
        draw_shapes();

    }

    const is_on_resizing_boundary = ()=>{
        for(let boundary in boundarySelection.current){
            if(boundarySelection.current[boundary]==true)
                return true;
        }
        return false;
    }

    const mouse_move = (event)=>{
        event.preventDefault();
        const x = event.clientX;
        const y = event.clientY;
        const shapeIndex = index_of_shape_for_coordinates(x,y);
        const selShapeIndex = selectedShapeIndices.current[0];
        if(!isDragging.current){
           
            if(shapeIndex!=-1){
                
                let checkedBoundaries = is_mouse_on_resizable_boundary(x,y,currentShapes.current[shapeIndex]);
                const onLeft = checkedBoundaries.left&&isResizable.current&&shapeIndex==selShapeIndex;
                const onRight= checkedBoundaries.right&&isResizable.current&&shapeIndex==selShapeIndex;
                const onTop = checkedBoundaries.top&&isResizable.current&&shapeIndex==selShapeIndex;
                const onBottom = checkedBoundaries.bottom&&isResizable.current&&shapeIndex==selShapeIndex;
        
                if(onLeft||onRight){
                    
                    canvasRef.current.style.cursor = 'col-resize';
                }else
                if(onBottom||onTop){
                    canvasRef.current.style.cursor = 'ns-resize';
                }else if(isResizable.current&&shapeIndex==selShapeIndex){
               
                    canvasRef.current.style.cursor = 'move';
                }
                else{
                    canvasRef.current.style.cursor = 'auto';
                }
                hightLightedLayers.current = [];
                hightLightedLayers.current.push({...currentShapes.current[shapeIndex],color:highlightColor});
            }else{
                hightLightedLayers.current = [];
                canvasRef.current.style.cursor = 'crosshair';
            }

        }

        
        if(isDragging.current&&isResizable.current&&is_on_resizing_boundary()){
    
            //Resizing
       
            console.log('resizing');

            if(boundarySelection.current.left){
                canvasRef.current.style.cursor = 'col-resize';
                const shape = currentShapes.current[selShapeIndex];
                const dx = x-shape.x;
                currentShapes.current = [...currentShapes.current.splice(0,selShapeIndex),{...shape,x:shape.x+dx,width:shape.width-dx},...currentShapes.current.splice(selShapeIndex+1,currentShapes.current.length)];
                selectedLayers.current = [];
                selectedLayers.current.push({...shape,color:selectedShapeColor});
                hightLightedLayers.current = [];
                
            }else
            if(boundarySelection.current.right){
                canvasRef.current.style.cursor = 'col-resize';
                const shape = currentShapes.current[selShapeIndex];
                const dx = x-(shape.x+shape.width);
                currentShapes.current = [...currentShapes.current.splice(0,selShapeIndex),{...shape,width:shape.width+dx},...currentShapes.current.splice(selShapeIndex+1,currentShapes.current.length)];
                selectedLayers.current = [];
                selectedLayers.current.push({...shape,color:selectedShapeColor});
                hightLightedLayers.current = [];
            }else
            if(boundarySelection.current.bottom){
                canvasRef.current.style.cursor = 'ns-resize';
                const shape = currentShapes.current[selShapeIndex];
                const dy = y-(shape.y+shape.height);
                currentShapes.current = [...currentShapes.current.splice(0,selShapeIndex),{...shape,height:shape.height+dy},...currentShapes.current.splice(selShapeIndex+1,currentShapes.current.length)];
                selectedLayers.current = [];
                selectedLayers.current.push({...shape,color:selectedShapeColor});
                hightLightedLayers.current = [];
            }else if(boundarySelection.current.top){
                canvasRef.current.style.cursor = 'ns-resize';
                const shape = currentShapes.current[selShapeIndex];
                const dy = y-(shape.y);
                currentShapes.current = [...currentShapes.current.splice(0,selShapeIndex),{...shape,y:y,height:shape.height-dy},...currentShapes.current.splice(selShapeIndex+1,currentShapes.current.length)];
                selectedLayers.current = [];
                selectedLayers.current.push({...shape,color:selectedShapeColor});
                hightLightedLayers.current = [];
            }
        
        }else 
        if(isDragging.current&&isShapeSelected.current){
            //moving
            console.log('moving');
            const shape = JSON.parse(JSON.stringify(currentShapes.current[selShapeIndex]));
            const dx = x-pinnedCoordiantes.current.x;
            const dy = y-pinnedCoordiantes.current.y;
            
            shape.x = pinnedShapeHandles.current.x+dx;
            shape.y = pinnedShapeHandles.current.y+dy;
  
            currentShapes.current = [...currentShapes.current.splice(0,selShapeIndex),{...shape},...currentShapes.current.splice(selShapeIndex+1,currentShapes.current.length)];
            selectedLayers.current = [];
            selectedLayers.current.push({...shape,color:selectedShapeColor});
            hightLightedLayers.current = []; 

        }else 
        if(isDragging.current){
            //new shape
            console.log('new-shape-drag');
            const dx = x - pinnedCoordiantes.current.x;
            const dy = y - pinnedCoordiantes.current.y;

            newShape.current = {x:pinnedCoordiantes.current.x,y:pinnedCoordiantes.current.y,width:dx,height:dy,color:'orange'};
        }

        setAnnLayer((prev)=>[...currentShapes.current]);
        draw_shapes();

    }

    const mouse_out = (event)=>{
        event.preventDefault();
        if(isDragging.current){
            finish_dragging();
        }
        isShapeSelected.current = false;
        isDragging.current = false;
    
        draw_shapes();
    }

    const index_of_shape_for_coordinates = (x,y)=>{
        let shapeIndex = 0;
        let selectedIndex = -1;

        for(let shape of currentShapes.current){
            if(is_mouse_on_shape(x,y,shape)){
                selectedIndex = shapeIndex;
                break;
            }
            shapeIndex++;
    }

    return selectedIndex;

}

    const finish_dragging = ()=>{
        if(JSON.stringify(newShape.current)!='{}'){
            currentShapes.current.push({...newShape.current});
            setAnnLayer((prevList)=>[...prevList,{...newShape.current}]);
            setAnnLayersMap((prevMap)=>[...prevMap,{layer:'layer'+currentShapes.current.length,label:''}]);
            newShape.current = {};
        }
    }

    return <canvas id="imageCanvas" 

        onMouseDown={mouse_down}
        onMouseUp = {mouse_up}
        onMouseMove = {mouse_move}
        onMouseOut = {mouse_out}
        ref = {canvasRef}
    />


}