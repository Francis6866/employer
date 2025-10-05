import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import z from "zod"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer'
import { Button } from './ui/button'
import { Input } from './ui/input'
import useFetch from '@/hooks/useFetch'
import { addNewJob } from '@/api/apiJobs'
import { addNewCompany } from '@/api/apiCompany'
import { BarLoader } from 'react-spinners'


const schema = z.object({
    name: z.string().min(1, { message: "Company name is required"}),
    logo: z.any().refine((file) => 
    file[0] && 
    (file[0].type === "image/png" ||
    file[0].type === "image/jpeg"), {message: "Only png or jpeg are allowed"}),
})

const AddCompanyDrawer = ({ fetchCompanies }) => {
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
        fxn: fetchAddNewCompany,
        data: dataAddNewCompany,
        error: errorAddNewCompany,
        loading: loadingNewCompany
      } = useFetch(addNewCompany)

    const onSubmit = (data) => {
        fetchAddNewCompany({
            ...data,
            logo: data.logo[0]
        })
        reset()
    }

    useEffect(() => {
        if(dataAddNewCompany?.length > 0){
            fetchCompanies()
        }
    }, [loadingNewCompany])

  return (
    <Drawer>
        <DrawerTrigger>
            <Button 
                type="button"
                size="sm"
                variant="secondary"
            >
                Add Company
            </Button>
        </DrawerTrigger>
        <DrawerContent>
            <DrawerHeader>
            <DrawerTitle>Add a New Company</DrawerTitle>
            </DrawerHeader>

            <form className='flex gap-2 p-4 pb-0'>
                <div>
                    <Input
                        placeholder="Company name"
                        {...register("name")} 
                    />
                </div>
                <div>
                    <Input
                        type="file"
                        accept="image/*"
                        className="file:text-gray-500"
                        {...register("logo")} 
                    />
                </div>

                <Button
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                    variant="destructive"
                    className="w-40"
                >
                    Add
                </Button>
            </form>
            {errors.name && <p className='text-red-500'>{errors.name.message}</p>}
            {errors.logo && <p className='text-red-500'>{errors.logo.message}</p>}


            {errorAddNewCompany && <p className='text-red-500'>{errorAddNewCompany.message}</p>}

        {loadingNewCompany && <BarLoader className="my-4" width={"100%"} color="#36d7b7"/>}

            <DrawerFooter>
            <DrawerClose asChild>
                <Button 
                    variant="secondary" type="button"
                >Cancel</Button>
            </DrawerClose>
            </DrawerFooter>
        </DrawerContent>
    </Drawer>
  )
}

export default AddCompanyDrawer