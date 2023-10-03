import { useState } from "react";
import apiKeyConfig from "../apiKeyConfig";
import axios from 'axios'
const useObtainDistance = ()=>{
 const [distance, setDistance] = useState('');
 const [duration, setDuration ] = useState('');
 const [loading,setLoading] = useState(false)
 const [error, setError] = useState(error)
 const obtainDistance = async (origin, destination)=>{
  const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKeyConfig}`
  try{
  setLoading(true)

  const {data} = await axios.get(apiUrl)
  
  setDistance(data.routes[0].legs[0].distance.text)
  setDuration(data.routes[0].legs[0].duration.text)
  }
  catch(error){
   setError(error)
  }
  finally{
   setLoading(false)
  }




 }
 return {obtainDistance, distance, duration, loading, error}
}
export default useObtainDistance