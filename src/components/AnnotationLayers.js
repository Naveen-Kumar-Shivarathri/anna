import {atom} from 'recoil';

export const annotationLayers = atom({
    key:'annotationLayers',
    default:[]
});

export const annotationLayersMap = atom({
    key:'annotationLayersMap',
    default:[]
});

export const selectedLayersIndices = atom({
    key:'selectedLayersIndices',
    default:[-1]
});