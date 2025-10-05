import useFetch from '@/hooks/useFetch';
import { useUser } from '@clerk/clerk-react';
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners';
import ApplicationCard from './ApplicationCard';
import { getApplications } from '@/api/apiApplication';

const CreatedApplications = () => {
  const { user, isLoaded } = useUser()
  const { 
    fxn: fetchApplications,
    data: applications,
    loading: loadingApplications
  } = useFetch(getApplications, {user_id: user.id})

  useEffect(() => {
    if(isLoaded) fetchApplications()
 }, [isLoaded]);

 if(loadingApplications){
  return <BarLoader className="mb-4" width={"100%"} color="#36d7b7"/>
}
  return (
    <div className='flex flex-col gap-2'>
      {applications?.map((application) => {
              return <ApplicationCard
                      key={application.id}
                      application={application}
                      isCandidate
                     />
            })}
    </div>
  )
}

export default CreatedApplications