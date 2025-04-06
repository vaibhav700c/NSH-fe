'use client'

import AddContainers from "../components/AddContainers";
import Landing from  '../components/Landing.jsx'
// const ThreeComponent = dynamic(() => import('../app/components/Box_Hearth.js'),{ ssr: false });

const ThreePage = () => {
  return (
    <div className='w-full h-full'>
      {/* <h1>pizza</h1> */}
      {/* <ThreeComponent /> */}
      {/* <Box_Hearth></Box_Hearth> */}
      <Landing></Landing>
      <AddContainers></AddContainers>
    </div>
  );
};

export default ThreePage;