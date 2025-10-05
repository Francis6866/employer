import React from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import { Button } from './ui/button'
import { Input } from './ui/input'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import useFetch from '@/hooks/useFetch'
import { BarLoader } from 'react-spinners'
import { applyToJob } from '@/api/apiApplication'

const schema = z.object({
    experience: z.number().min(0, {message: "Experience must be at least 0"}).int(),

    skills: z.string().min(0, {message: "Skills are Required"}),  

    education: z.enum(["intermediate", "graduate", "post-graduate"], {message: "Education is Required"}),

    resume: z.any().refine((file) => 
    file[0] && 
    (file[0].type === "application/pdf" ||
    file[0].type === "application/msword"), {message: "Only PDF or Word documents are allowed"})
})

const ApplyJob = ({ job, user, applied = false, fetchJobs }) => {
    const { 
        register, 
        handleSubmit, 
        control, 
        formState:{errors}, 
        reset
    } = useForm({
        resolver: zodResolver(schema),
    })

    const { 
        fxn: fetchApply,
        error: applyError,
        loading: loadingApply 
      } = useFetch(applyToJob)

    const onSubmitForm = (data) => {
        fetchApply({
            ...data,
            job_id: job.id,
            candidate_id: user.id,
            name: user.fullName,
            status: "applied",
            resume: data.resume[0]
        }).then(() => {
            fetchJobs()
            reset()
        })
    }
    // || !job.isOpen 
    // console.log(zodResolver)
  return (
    <Drawer open={applied ? false : undefined}>
        <DrawerTrigger>
            <Button 
                variant={job?.isOpen && !applied ? "blue" : "destructive" }
                disabled={!job?.isOpen || applied}
                size="lg"
            >
                {job?.isOpen ? (applied ? "Applied" : "Apply") : "Closed"}
            </Button>
        </DrawerTrigger>
        <DrawerContent>
            <DrawerHeader>
            <DrawerTitle>Apply for {job?.title} at {job?.company?.name_of_company}</DrawerTitle>
            <DrawerDescription>Please Fill the form below</DrawerDescription>
            </DrawerHeader>

            <form
                onSubmit={handleSubmit(onSubmitForm)} 
                className='flex flex-col gap-4 p-4 pb-0'
            >
                <Input
                    type="number"
                    placeholder="Years of Experience"
                    className="flex-1" 
                    {
                        ...register("experience", {
                            valueAsNumber: true
                        })
                    }
                />
                {errors.experience && (
                    <p className='text-red-500'>{errors.experience.message}</p>
                )}
                <Input
                    type="text"
                    placeholder="Skills (Comma Seperated)"
                    className="flex-1"
                    {
                        ...register("skills")
                    } 
                />
                {errors.skills && (
                    <p className='text-red-500'>{errors.skills.message}</p>
                )}
                <Controller
                     name='education'
                     control={control}
                     render={({ field }) => {
                        return <RadioGroup
                        onValueChange={field.onChange}
                        {...field}
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="intermediate" id="intermediate" />
                        <Label htmlFor="intermediate">Intermediate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="graduate" id="graduate" />
                        <Label htmlFor="graduate">Graduate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="post-graduate" id="post-graduate" />
                        <Label htmlFor="post-graduate">Post Graduate</Label>
                    </div>
                </RadioGroup>
                     }}
                />
                {errors.education && (
                    <p className='text-red-500'>{errors.education.message}</p>
                )}
                <Input
                    type="file"
                    accept=".pdf, .doc, .docx"
                    className="flex-1 file:text-gray-500" 
                    {
                        ...register("resume")
                    } 
                />
                {errors.resume && (
                    <p className='text-red-500'>{errors.resume.message}</p>
                )}
                {applyError?.message && (
                    <p className='text-red-500'>{applyError?.message}</p>
                )}
                {loadingApply && <BarLoader className="mb-4" width={"100%"} color="#36d7b7"/>}
                <Button
                    type="submit"
                    variant="blue"
                    size="lg" 
                >
                    Apply
                </Button>
            </form>

            <DrawerFooter>
            
            <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
            </DrawerClose>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
  )
}

export default ApplyJob