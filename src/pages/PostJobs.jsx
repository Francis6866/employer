import { get_companies } from '@/api/apiCompany'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import useFetch from '@/hooks/useFetch'
import { useUser } from '@clerk/clerk-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { State } from 'country-state-city'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router-dom'
import { BarLoader } from 'react-spinners'
import z from 'zod'
import MDEditor from "@uiw/react-md-editor"
import { Button } from '@/components/ui/button'
import { addNewJob } from '@/api/apiJobs'
import AddCompanyDrawer from '@/components/AddCompanyDrawer'

const schema = z.object({
  title: z.string().min(1, {message: "Title is Required"}),
  description: z.string().min(1, {message: "Description is Required"}),
  location: z.string().min(1, {message: "Select a location"}),
  company_id: z.string().min(1, {message: "Select or Add a new Company"}),
  requirement: z.string().min(1, {message: "Requirements are Required"}),
})


const PostJobs = () => {
  const navigate = useNavigate()
  const { isLoaded, user } = useUser()

  const { 
    register, 
    handleSubmit, 
    control, 
    formState:{errors}, 
    reset
} = useForm({
  defaultValues: {
    location: "",
    company_id: "",
    requirements: ""
  },
    resolver: zodResolver(schema),
})

const { 
  fxn: fetchCompanies,
  data: companies,
  loading: loadingCompanies
} = useFetch(get_companies)
  

  useEffect(() => {
     if(isLoaded) fetchCompanies()
  }, [isLoaded]);

  const { 
    fxn: fetchAddJobs,
    data: AddJobs,
    error: errorAddJob,
    loading: loadingAddJobs
  } = useFetch(addNewJob)

  const onSubmit = (data) => {
    fetchAddJobs({
      ...data,
      recruiter_id: user.id,
      isOpen: true
    })
    reset()
  }

  useEffect(() => {
    if(AddJobs?.length > 0) navigate("/jobs")
  }, [loadingAddJobs])

  if(!isLoaded || loadingCompanies){
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7"/>
  }

  if(user?.unsafeMetadata?.role !== "recruiter"){
    return <Navigate to="/jobs"/>
  }

  return (
    <div>
      <h1 className='gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8'>Post a Job</h1>

      <form 
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-4 p-4 pb-0'
      >
        <div>
          <Input placeholder="Job Title" {...register("title")}/>
          {errors.title && <p className='text-red-500'>{errors.title.message}</p>}
        </div>
        <div>
          <Textarea placeholder="Job Description" {...register("description")}/>
          {errors.description && <p className='text-red-500'>{errors.description.message}</p>}
        </div>

        <div className='flex gap-4 items-center'>
          {/* location */}
          <Controller
            name='location'
            control={control}
            render={({field}) => {
              return <Select 
              value={field.value} 
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {State.getStatesOfCountry("NG").map(({name}) => {
                    return <SelectItem key={name} value={name}>{name}</SelectItem>
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
            }}
            /> {/* controller end */}


          {/* company */}
        <Controller
            name='company_id'
            control={control}
            render={({field}) => {
              return <Select 
              value={field.value} 
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Company">
                  {field?.value
                    ? companies?.find((com) => com.id === Number(field.value))
                    ?.name_of_company
                : "Company"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {companies?.map(({ name_of_company, id }) => {
                    return <SelectItem key={name_of_company} value={id}>{name_of_company}</SelectItem>
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
            }}
        />
        {errors.location && <p className='text-red-500'>{errors.location.message}</p>}
        {errors.company_id && <p className='text-red-500'>{errors.company_id.message}</p>}

        {/* add drawer */}
        <AddCompanyDrawer 
          fetchCompanies={fetchCompanies}
        />
        </div>

        <div>
        <Controller
            name='requirement'
            control={control}
            render={({field}) => (
              <MDEditor 
                value={field.value} 
                onChange={field.onChange} 
              />
            )}
        />
        {errors.requirement && <p className='text-red-500'>{errors.requirement.message}</p>}
        </div>

        {errorAddJob && <p className='text-red-500'>{errorAddJob.message}</p>}
        {loadingAddJobs && <BarLoader className="mb-4" width={"100%"} color="#36d7b7"/>}

        <Button
          type="submit"
          variant="blue"
          size="lg"
          className="mt-2"
        >Submit</Button>
      </form>
    </div>
  )
}

export default PostJobs