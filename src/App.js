import logo from './logo.svg';
import './App.css';

import WhiteBoard from './components/WhiteBoard';
import { RecoilRoot ,useRecoilState} from 'recoil';

function App() {
  
  const stackInformation = [];
  
  let images = document.getElementsByClassName("images");
  let imageCount=0;
  for(let image of images){
      console.log(imageCount);
      
          stackInformation.push({
            imageSource: image,
            annotationLayersList:[],
            annotationLabelMap:[]
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
