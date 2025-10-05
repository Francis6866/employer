import { getMyJobs } from '@/api/apiJobs';
import useFetch from '@/hooks/useFetch';
import { useUser } from '@clerk/clerk-react';
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners';
import JobCard from './JobCard';

const CreatedJobs = () => {
    const { user } = useUser()
    const { 
      fxn: fetchMyJobs,
      data: MyJobs,
      loading: loadingMyJobs
    } = useFetch(getMyJobs, {recruiter_id: user.id})
  
    useEffect(() => {
        fetchMyJobs()
   }, []);
  
   if(loadingMyJobs){
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7"/>
  }

  return (
    <div>
        {
        loadingMyJobs === false && (
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {
              MyJobs?.length ? (
                MyJobs.map(job => {
                  return <JobCard 
                        key={job.id} 
                        job={job}
                        isMyJob
                        onJobSaved={fetchMyJobs} 
                    />
                })
              ) : (
                <div>No Jobs Found</div>
              )
            }
          </div>
        )
      }
    </div>
  )
}

export default CreatedJobs