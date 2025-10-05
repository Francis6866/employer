import { supabaseClient } from "@/utils/supabase";

// from Home
// export async function getJobs({ location, company_id, searchQuery }){
//     const supabase = createClerkSupabaseClient()

//     let query = supabase.from("hired-jobs").select("*")

//     const { data, error } = await query

//     if(error) {
//         console.error("Error fetching Jobs:", error)
//         return null
//     }

//     return data
// }

// from supabase client
export async function get_Jobs(token, { location, company_id, searchQuery }){
    const supabase = await supabaseClient(token)

    let query = supabase.from("jobs").select("*, company:companies(name_of_company, logo_url), saved:saved_jobs(id)")

    if(location) {
        query = query.eq("location", location)
    }

    if(company_id) {
        query = query.eq("company_id", company_id)
    }

    if(searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`)
    }

    const { data, error } = await query

    if(error) {
        console.log("Error fetching Jobs:", error)
        return null
    }

    return data
}

export async function save_Jobs(token, { alreadySaved }, saveData){
    const supabase = await supabaseClient(token)

    if(alreadySaved){
        const { data, error:deleteError } = await supabase
        .from("saved_jobs")
        .delete()
        .eq("job_id", saveData.job_id)
        
        if(deleteError) {
            console.log("Error Deleting Saved Job:", deleteError)
            return null
        }

        return data
    }else {
        const { data, error: insertError } = await supabase
        .from("saved_jobs")
        .insert([saveData])
        .select()

        if(insertError) {
            console.log("Error fetching Jobs:", insertError)
            return null
        }

        return data

    }
   
}


export async function get_singleJob(token, {job_id}){
    const supabase = await supabaseClient(token)

    const { data, error } = await supabase
        .from("jobs")
        .select("*, company:companies(name_of_company, logo_url), applications:applications!hired-applications_job_id_fkey(*)")
        .eq("id", job_id)
        .single();
        
    if(error) {
        console.log("Error fetching job:", error)
        return null
    }

     return data
}


export async function update_hiringStatus(token, {job_id}, isOpen){
    const supabase = await supabaseClient(token)

    const { data, error } = await supabase
        .from("jobs")
        .update({isOpen})
        .eq("id", job_id)
        .select();
        
    if(error) {
        console.log("Error updating job:", error)
        return null
    }

    return data
}

export async function addNewJob(token, _, jobData){
    const supabase = await supabaseClient(token)

    const { data, error } = await supabase
        .from("jobs")
        .insert([jobData])
        .select();
        
    if(error) {
        console.log("Error Creating job:", error)
        return null
    }

    return data
}


export async function getSavedJobs(token, _, jobData){
    const supabase = await supabaseClient(token)

    const { data, error } = await supabase
        .from("saved_jobs")
        .select("*, job:jobs(*, company:companies(name_of_company, logo_url))");
        
    if(error) {
        console.log("Error fetching Saved Job:", error)
        return null
    }

    return data
}

export async function getMyJobs(token, {recruiter_id}){
    const supabase = await supabaseClient(token)

    const { data, error } = await supabase
        .from("jobs")
        .select("*, company:companies(name_of_company, logo_url)")
        .eq("recruiter_id", recruiter_id)
        
    if(error) {
        console.log("Error fetching Job:", error)
        return null
    }

    return data
}

export async function deleteMyJobs(token, {job_id}){
    const supabase = await supabaseClient(token)

    const { data, error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", job_id)
        .select("")
        
    if(error) {
        console.log("Error deleting Job:", error)
        return null
    }

    return data
}