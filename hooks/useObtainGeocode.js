import { useState } from "react";
import axios from "axios";
import apiKeyConfig from "../apiKeyConfig";
import { useDispatch } from "react-redux";
import { modifyData } from "../store/requestSlice";
const useObtainGeocode = ()=>{
 
  const dispatch = useDispatch()

  
  const [loading, setLoading] = useState(false)
  const [geocode, setGeocode] = useState('')
   
 async function reverseGeocode(location,type) {
  if (!location) return
  const { latitude, longitude } = location
  
  try {
   setLoading(true)
   
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKeyConfig}`
    );
  

    if (response.data && response.data.results.length > 0) {
      // Extract the formatted address or location name from the API response
    
      const locationName = response.data.results[0].formatted_address;
      const address = response.data.results[0].address_components[2].long_name
      const geo = address + ' ,' + locationName;
      if(type){
        dispatch(modifyData({data:geo, type:`${type}_GEOCODE`}))

      }
      else{
        setGeocode(geo)
      }
    } else {
     console.log('location not found')
      return 'Location not found';
    }
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return 'Error occurred';
  } finally {
    setLoading(false)
  }
 
 
 }
  
 return {reverseGeocode, geocode, loading}
 
}
export default useObtainGeocode