import {Link} from 'react-router-dom';

const Home = () => {
  return (
    <div className='bg-gray-800 text-white h-[100vh] w-[100%] flex flex-col items-center justify-center'>
    <h1 className='text-4xl text-center font-extrabold'>Welcome to AiGenesis</h1>
    <img src='./land.png' alt='landing-pic' className='w-[20%] h-auto' />
    <div className='w-full items-center justify-center gap-6 flex'>
    <Link className='bg-black flex items-center justify-center p-2 rounded-md text-lg w-[10%]' to="/signup">Sign Up</Link>  
    <Link className='w-[10%] flex items-center justify-center bg-black p-2 rounded-md text-lg' to="/login">Login</Link> 
   </div>
  </div>
  )
}

export default Home