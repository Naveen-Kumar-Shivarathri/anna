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

export const labels = atom({
key:'labels',
default:['label1','label2','label3']
});

export const userDefinedLabels = atom({
    key:'userDefinedLabels',
    default:[]
});