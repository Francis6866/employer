import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Link } from "react-router-dom"
import companies from "../data/companies.json"
import faqs from "../data/faq.json"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const LandingPage = () => {
  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">
      <section className="text-center">
        <h1 className="flex flex-col items-center justify-center gradient-title text-4xl sm:text-6xl lg:text-8xl font-extrabold tracking-tighter py-4">Find Your Dream Job{" "}
          <span className="flex items-center gap-2 sm:gap-6"> and get{" "}
            <img src="/logo.png" alt="hired logo" className="h-14 sm:h-24 lg:h-32" />
          </span>
        </h1>
        <p className="text-gray-300 sm:mt-4 text-xs sm:text-xl">
          Explore thousands of jobs listings or find the perfect candidate
        </p>
      </section>

        {/* buttons */}
      <div className="flex gap-6 justify-center items-center">
        <Link to="/jobs">
          <Button
            variant="blue"
            size="xl"
          >
            Find Jobs
          </Button>
        </Link>
        <Link to="/post-job">
          <Button
            variant="destructive"
            size="xl"
          >
            Post a Jobs
          </Button>
        </Link>
      </div>

      {/* carousel */}
      <div>
      <Carousel 
        plugins={[Autoplay({ delay: 2000 })]}
        className="w-full py-10"
      >
      <CarouselContent className="flex gap-5 sm:gap-20 items-center">
        {
          companies.map(({ name, id, path }) => {
            return <CarouselItem 
              key={id}
              className="basis-1/3 lg:basis-1/6"
            >
              <img 
              src={path} 
              alt={name} 
              className="h-9 sm:h-14 object-contain"
              />
            </CarouselItem>
          })
        }
      </CarouselContent>
    </Carousel>
      </div>

      {/* banner */}
      <div>
        <img src="/banner.jpeg" alt="Banner" className="w-full" />
      </div>

        {/* cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>For Job Seekers Title</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Search and apply for jobs, track applicationm and more.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>For Employers</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Post jobs, manage applications and find the best candidates.</p>
          </CardContent>
        </Card>
      </section>

      {/* Accordion */}
      <div>
        <Accordion type="single" collapsible>
          {faqs.map((faq, index) => {
             return (
             <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="py-2"
            >
                <AccordionTrigger className="cursor-pointer">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
              )
          })}
        </Accordion>
      </div>
    </main>
  )
}

export default LandingPage