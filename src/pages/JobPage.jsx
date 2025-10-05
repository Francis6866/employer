import { get_singleJob, update_hiringStatus } from "@/api/apiJobs"
import useFetch from "@/hooks/useFetch"
import { useUser } from "@clerk/clerk-react"
import MDEditor from "@uiw/react-md-editor"
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { BarLoader } from "react-spinners"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ApplyJob from "../components/ApplyJob"
import ApplicationCard from "@/components/ApplicationCard"

const JobPage = () => {
  const { isLoaded, user} = useUser()
  const { id } = useParams()

  const { 
    fxn: fetchJobs,
    data: dataJobs,
    loading: loadingJobs 
  } = useFetch(get_singleJob, { job_id: id })

  const { 
    fxn: fxnHiringStatus,
    // data: dataJobs,
    loading: loadingHiringStatus 
  } = useFetch(update_hiringStatus, { job_id: id })

  const handleStatusChange = (value) => {
    const isOpen = value === "open"
    fxnHiringStatus(isOpen)
  }

  useEffect(() => {
    if(isLoaded) fetchJobs()
 }, [isLoaded, id]);

 if(!isLoaded || loadingJobs){
  return <BarLoader className="mb-4" width={"100%"} color="#36d7b7"/>
}

console.log("dataJob", dataJobs)
  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold text-4xl sm:text-6xl pb-3">{dataJobs?.title}</h1>
        <img 
          src={dataJobs?.company?.logo_url} 
          alt={dataJobs?.title}
          className="h-12" 
        />
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <MapPinIcon />
          {dataJobs?.location}
        </div>

        <div className="flex gap-2">
          <Briefcase />
          {dataJobs?.applications?.length}
        </div>

        <div className="flex gap-2">
          {dataJobs?.isOpen ? (
          <><DoorOpen/> Open</>) : (
          <><DoorClosed/> Closed</> 
          )}
        </div>
      </div>

      {/* hiring status */}
      {loadingHiringStatus && <BarLoader className="mb-4" width={"100%"} color="#36d7b7"/>}
      {dataJobs?.recruiter_id === user?.id && (
         <Select  
         onValueChange={handleStatusChange}
       >
         <SelectTrigger 
          className={`w-full ${dataJobs?.isOpen ? "bg-green-950" : "bg-red-950"}`}
         >
           <SelectValue placeholder={`Hiring Status ${dataJobs?.isOpen ? "( Open )" : "( Closed )"}`} />
         </SelectTrigger>
         <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
         </SelectContent>
       </Select>
      )}


      <h2 className="text-2xl sm:text-3xl font-bold">About the Job</h2>
      <p className="sm:text-lg">{dataJobs?.description}</p>

      <h2 className="text-2xl sm:text-3xl font-bold">What we are looking for!</h2>
      <MDEditor.Markdown source={dataJobs?.requirement} className="bg-transparent sm:text-lg"/>

      {/* render applications */}
      {dataJobs?.recruiter_id !== user?.id && (
        <ApplyJob
           job={dataJobs}
           user={user}
           fetchJobs={fetchJobs}
           applied={dataJobs?.applications.find((ap) => ap.candidate_id === user.id)}
        />
         )}

        {dataJobs?.applications?.length > 0 && dataJobs?.recruiter_id === user.id && (
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold">Applications</h2>
            {dataJobs?.applications.map((application) => {
              return <ApplicationCard
                      key={application.id}
                      application={application}
                     />
            })}
          </div>
        )}
    </div>
  )
}

export default JobPage 