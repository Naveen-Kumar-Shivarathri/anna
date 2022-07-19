import logo from './logo.svg';
import './App.css';

import WhiteBoard from './components/WhiteBoard';
import { RecoilRoot ,useRecoilState} from 'recoil';

function App() {
  
  const stackInformation = [];
  
  let images = document.getElementsByClassName("images");
  let imageCount=0;
  for(let image of images){
          stackInformation.push({
            imageSource: image,
            annotationLayersList:[],
            annotationLabelMap:[],
            height:500,
            width:500,
            annLayerBoundary:5
          })
        
      imageCount++;
  }
  

  return <RecoilRoot>
    <div>
    <WhiteBoard stackInformation={stackInformation}/>
    </div>
  </RecoilRoot>;
}

export default App;
