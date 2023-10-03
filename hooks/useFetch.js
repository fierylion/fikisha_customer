import { useState, useEffect } from 'react'

import {api} from '../api'

const useFetch = () => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const obtainData = (url, method = 'get', body = null, options = {}) => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      setData(null)
      

      try {
        const response = await api({
          method,
          url,
          ...options,
          data: body,
        })
        console.log(response)
        setData(response.data)
      } catch (error) {
        console.log(error)
        setError(error)
      }

      setIsLoading(false)
    }

    return fetchData()
  }


  return { data, isLoading, error,setData, setIsLoading, setError, obtainData }
}

export default useFetch
