import React, { useEffect, useState ,useRef} from 'react';

import { atom, useRecoilState } from 'recoil';
import { annotationLayers } from './AnnotationLayers';

export function CanvasElement({imageStack}){

    const [annLayers, setAnnLayer] = useRecoilState(annotationLayers);

    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const canvas_width = useRef(null);
    const canvas_height = useRef(null);
    const imgRef = useRef(null);
    //const [shapes,setShapes] = useState([]);
    const shapes = useRef([]);
    const [clickedCordinates, setClickedCordinates] = useState({});
    const is_dragging = useRef(false);
    const shape_dragging = useRef(false);
    const current_shape_index = useRef(null);
    const new_shape = useRef(null);
    const selected = 'red';
    const border_thickness = 5;
    const box_selected = useRef(false);
    const box_selected_index = useRef(null);
    const [selBoxes,setSelBoxes] = useState([]);

    const setShapes = (shapesList)=>{
        shapes.current = shapesList;
    }
    

    useEffect(()=>{
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas_width.current = window.innerWidth;
        //canvas.style.width = `${window.innerWidth}px`;
        canvas_height.current = window.innerHeight;
        //canvas.style.height = canvas_height.current;
        const context = canvas.getContext("2d");
        context.lineCap = "round";
        console.log(imageStack.imageSource);
        imgRef.current = imageStack.imageSource;
        contextRef.current = context;
        draw_shapes();

    },[]);


    const draw_shapes = () =>{
        const context = contextRef.current;
        context.clearRect(0, 0, canvas_width.current, canvas_height.current);
        context.drawImage(imageStack.imageSource, 0, 0);
        for (let shape of shapes.current) {
            context.strokeStyle = shape.color;
            context.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
        for(let shape of selBoxes){
            context.strokeStyle = selected;
            context.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
    }

    let draw_specified_shapes = (shapesList) =>{
        draw_shapes();
        const context = contextRef.current;
        for (let shape of shapesList) {
            context.strokeStyle = shape.color;
            context.strokeRect(shape.x, shape.y, shape.width, shape.height);
    
        }
    }

    const is_mouse_in_shape = (x, y, shape) =>{
        let shape_left = shape.x;
        let shape_right = shape.x + shape.width;
        let shape_top = shape.y;
        let shape_bottom = shape.y + shape.height;
    
        if (x > shape_left && x < shape_right && y > shape_top && y < shape_bottom) {
            return true;
        }
    
        return false;
    
    }

    const is_mouse_on_shape = (x, y, shape) =>{

        let left_buffer_region = shape.x + border_thickness;
        let right_buffer_region = shape.x + shape.width - border_thickness;
        let top_buffer_region = shape.y + border_thickness;
        let bottom_buffer_region = shape.y + shape.height - border_thickness;
    
        if ((is_mouse_in_shape(x, y, shape)) && ((x > shape.x && x < left_buffer_region) || (y > shape.y && y < top_buffer_region) || (x > right_buffer_region && x < shape.x + shape.width) || (y > bottom_buffer_region && y < shape.y + shape.height)))
            return true;
    
        return false;
    }

    

    const mouse_down = function (event) {
        console.log('mouse down');
        event.preventDefault();
        setClickedCordinates(()=>({startX:event.clientX,startY:event.clientY}));
        let index = 0;
        for (let shape of shapes.current) {
            if (is_mouse_on_shape(event.clientX, event.clientY, shape)) {
                current_shape_index.current = index;
                shape_dragging.current = true;
                box_selected.current = true;
                is_dragging.current = true;
                box_selected_index.current = index;
                setSelBoxes([shapes.current[index]]);
                return;
            }
            index++;
        }

        box_selected.current = false;
        setSelBoxes([]);
        is_dragging.current = true;

    }

    const mouse_up = (event) =>{
        console.log('clicked up');
        event.preventDefault();
        
        if (!shape_dragging.current && !is_dragging.current) {
            return;
        }
    
        if (is_dragging.current) {
            console.log('saving object');
           
            let newLayer = {...new_shape.current};
            if(JSON.stringify(newLayer)!='{}')
            {
            setShapes([...shapes.current,newLayer]);
            new_shape.current = null;
            draw_specified_shapes([...shapes.current,newLayer]);
            setAnnLayer([...shapes.current]);
            console.log(annLayers);
            }
        }

        shape_dragging.current = false;
        is_dragging.current = false;
    
    }

    const mouse_out =  (event) =>{
        event.preventDefault();
        if (!shape_dragging.current)
            return;
    
        shape_dragging.current = false;
        is_dragging.current = false;
    }

    const is_mouse_on_left_boundary = (x,y,shape)=>{
        let left_buffer_region = shape.x + border_thickness;
      
        if ((is_mouse_in_shape(x, y, shape)) && (x > shape.x && x < left_buffer_region) )
            return true;
    
        return false;
    }

    const mouse_move = (event) =>{
        //console.log(clickedCordinates.startX, clickedCordinates.startY);
        //console.log(event.clientX,event.clientY);
        event.preventDefault();
        let mouseX = parseInt(event.clientX);
        let mouseY = parseInt(event.clientY);

        if(box_selected.current){
            const canvas = canvasRef.current;
            if(is_mouse_on_left_boundary(mouseX,mouseY,selBoxes[0])){
                canvas.style.cursor = "col-resize";
                if(is_dragging.current){
               console.log('dragging');
                let resizingShape = JSON.parse(JSON.stringify(shapes.current[box_selected_index.current]));
                let dx = mouseX - clickedCordinates.startX;
               
                resizingShape.x += dx;
                resizingShape.width +=dx;
                console.log([...shapes.current.slice(0,box_selected_index.current),resizingShape,...shapes.current.slice(box_selected_index.current+1)]);
                setShapes([...shapes.current.slice(0,box_selected_index.current),resizingShape,...shapes.current.slice(box_selected_index.current+1)]);
                console.log(shapes);
                draw_shapes();
                }
            }
            else
                canvas.style.cursor = 'auto';
             
        }
    
        if (!shape_dragging.current && !is_dragging.current) {
            let selectable_shape_index = -1;
            const highlighted_list = [];
            for (let index in shapes.current) {
                if (is_mouse_on_shape(mouseX, mouseY, shapes.current[index])) {
                    selectable_shape_index = index;
                    break;
                }
            }
            if (selectable_shape_index != -1) {
                let temp_shape = shapes.current[selectable_shape_index];
                const selectedShape = { ...temp_shape };
                selectedShape.color = selected;
                highlighted_list.push(selectedShape)
    
            }
            if (highlighted_list.length > 0) {
                draw_specified_shapes(highlighted_list);
            }
            else
                draw_shapes();
            return;
    
        } else if (shape_dragging.current) {
    
            let dx = mouseX - clickedCordinates.startX;
            let dy = mouseY - clickedCordinates.startY;
            //console.log(shapes);
            let shapesCopy = JSON.parse(JSON.stringify(shapes.current));
            console.log(shapesCopy[current_shape_index.current]);
            shapesCopy[current_shape_index.current].x = dx;
            shapesCopy[current_shape_index.current].y = dy;
            setShapes(shapesCopy);
            setAnnLayer([...shapes.current]);
            draw_shapes();
    
        } else {
            console.log('drawing new shape');
            console.log(clickedCordinates.startX, clickedCordinates.startY);
            let dx = mouseX - clickedCordinates.startX;
            let dy = mouseY - clickedCordinates.startY;
    
            new_shape.current = { x: clickedCordinates.startX, y: clickedCordinates.startY, width: dx, height: dy, color: 'orange' };
            console.log(new_shape.current);
            draw_specified_shapes([new_shape.current]);
    
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