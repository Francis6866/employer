import { useState } from "react"
import { useSession } from "@clerk/clerk-react"

const useFetch = (cb, options = {}) => {
    const [ data, setData ] = useState(undefined)
    const [ loading, setLoading ] = useState(undefined)
    const [ error, setError ] = useState(undefined)

    const { session } = useSession()


    const fxn = async (...args) => {
        if (!session) {
            setError("No active session");
            return;
          }
      

        setLoading(true)
        setError(null)

        try {
            const supabaseAccessToken = await session?.getToken({
                template: "supabase",
              });

              if(supabaseAccessToken){
              const response = await cb(supabaseAccessToken, options, ...args)
              
              setData(response)
              setError(null)
              }

            } catch (error) {
                setError(error)
            } finally{
                setLoading(false)
        }
    }

    return { fxn, data, loading, error}
}

export default useFetch