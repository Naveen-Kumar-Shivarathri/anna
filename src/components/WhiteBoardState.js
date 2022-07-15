import {atom} from 'recoil';


export const whiteBoardState = atom({
key:'imageStack',
default:[]
});

export const currentImageStack = atom({
key:'stackIndex',
default:0
});
