import { supabaseClient, supabaseUrl } from "@/utils/supabase"

export async function get_companies(token){
    const supabase = await supabaseClient(token)

    const { data, error } = await supabase
        .from("companies")
        .select("*")
        
    if(error) {
        console.log("Error fetching companies:", error)
        return null
    }

    console.log("from get companies", data)
    return data
}

export async function addNewCompany(token, _, companyData){
    const supabase = await supabaseClient(token)

    const random = Math.floor(Math.random() * 9000);
    const fileName = `logo-${random}-${companyData.name}`

    const {error: storageError} = await supabase.storage.from("company-logo").upload(fileName, companyData.logo)

    if(storageError) {
        console.log("Error uploading company logo:", storageError)
        return null
    }

    const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`


    const { data, error } = await supabase
        .from("companies")
        .insert([{
             name_of_company: companyData.name,
             logo_url
        }])
        .select()
        
    if(error) {
        console.log("Error submitting company:", error)
        return null
    }

    console.log("from get companies", data)
    return data
}