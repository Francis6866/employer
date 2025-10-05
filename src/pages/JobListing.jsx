import { get_companies } from "@/api/apiCompany";
import { get_Jobs } from "@/api/apiJobs";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { City, State } from "country-state-city";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("")
  const [company_id, setCompany_id] = useState("")
  const {isLoaded} = useUser()

const { 
  fxn: fetchJobs,
  data: dataJobs,
  loading: loadingJobs 
} = useFetch(get_Jobs, { location, company_id, searchQuery })

const { 
  fxn: fetchCompanies,
  data: companies,
} = useFetch(get_companies)
  

  useEffect(() => {
     if(isLoaded) fetchJobs()
  }, [isLoaded, location, company_id, searchQuery]);

  useEffect(() => {
     if(isLoaded) {
      fetchCompanies()
    }
  }, [isLoaded]);
  
  if(!isLoaded){
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7"/>
  }

  const handleSearch = (e) => {
    e.preventDefault()
    let formData = new FormData(e.target);

    const query = formData.get("search-query")
    if(query) setSearchQuery(query)
  }

  const clearFilters = () => {
    setCompany_id("")
    setSearchQuery("")
    setLocation("")
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center p-8">Latest Jobs</h1>

      {/* filter */}
      <form onSubmit={handleSearch} className="h-14 flex w-full gap-2 items-center mb-3">
        <Input 
          type="text"
          placeholder="Search jobs by Title"
          name="search-query"
          className="h-full flex-1 px-4 text-md" 
        />
        <Button 
          type="submit"
          className="h-full sm:w-28"
          variant="blue"
          >Search</Button>
      </form>

      <div className="flex flex-col sm:flex-row gap-2">
        {/* location */}
        <Select 
          value={location} 
          onValueChange={(value) => setLocation(value)}
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

        {/* company */}
        <Select 
          value={company_id} 
          onValueChange={(value) => setCompany_id(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.map(({ name_of_company, id }) => {
                return <SelectItem key={name_of_company} value={id}>{name_of_company}</SelectItem>
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          variant="destructive"
          className="w-1/4"
          onClick={clearFilters}
        >Clear Filters</Button>
      </div>

      {
        loadingJobs && (
          <BarLoader className="mt-4" width={"100%"} color="#36d7b7"/>
        )
      }

      {
        loadingJobs === false && (
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {
              dataJobs?.length ? (
                dataJobs.map(job => {
                  return <JobCard 
                        key={job.id} 
                        job={job}
                        savedInt={job.saved?.length > 0} 
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
  );
};

export default JobListing;
