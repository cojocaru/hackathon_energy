"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from 'axios';

import { cn } from "@/lib/utils"
import { Button } from "@/registry/new-york/ui/button"
import { Calendar } from "@/registry/new-york/ui/calendar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/registry/new-york/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/registry/new-york/ui/form"
import { Input } from "@/registry/new-york/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover"
import { toast } from "@/registry/new-york/ui/use-toast"
import { useState } from "react"

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const

const vulnerabilityLevels = [
  { label: "None", value: "0" },
  { label: "Scazuta", value: "1" },
  { label: "Medie", value: "2" },
  { label: "Ridicata", value: "3" },
  { label: "Foarte Ridicata", value: "4" },
] as const;

const heatingTypes = [
  { label: "Încălzire centralizată", value: "centralizata" },
  { label: "Electricitate", value: "electricitate" },
  { label: "Gaze naturale", value: "gaze_naturale" },
  { label: "Combustibil solid", value: "combustibil_solid" },
] as const;

const compensatedEnergyOptions = [
  { label: "Electricity", value: "0" },
  { label: "Natural Gas", value: "1" },
  { label: "Central Heating", value: "2" },
  { label: "Solid Fuel", value: "3" },
] as const;



const years = [];
for (let year = 2010; year >= 1960; year--) {
  years.push({ label: year.toString(), value: year.toString() });
}


const accountFormSchema = z.object({
  vulnerabilityLevel: z.string({
    required_error: "Please select a vulnerability level.",
  }),
  venit: z.string({
    required_error: "Venit is required.",
  }),
  birthYear: z.string({
    required_error: "Anul nașterii is required.",
  }),
  heatingType: z.string({
    required_error: "Please select a heating type.",
  }),
  compensatedEnergy: z.string({
    required_error: "Please select an energy option.",
  }),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  // name: "Your name",
  // dob: new Date("2023-01-23"),
}

export function AccountForm() {
  const [apiResponse, setApiResponse] = useState('');
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  })

  function onSubmit(data: AccountFormValues) {
    const payload = {
      AverageIncome: data.venit,
      Grad: data.vulnerabilityLevel,
      CompensatedEnergySource: data.compensatedEnergy,
      Tip_incalzire_principal: data.heatingType,
      DateOfBirth: data.birthYear,
      AlternativeEnergySources: "SomeValue" // Adjust as per your form structure
    };
  
    axios.post('http://127.0.0.1:8000/predict', payload)
      .then(response => {
        // Handle response
        setApiResponse(JSON.stringify(response.data, null, 2));
      })
      .catch(error => {
        // Handle error
        console.error("There was an error!", error);
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
  control={form.control}
  name="vulnerabilityLevel"
  render={({ field }) => (
    <FormItem className="flex flex-col">
      <FormLabel>Grad de vulnerabilitate</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-[200px] justify-between",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value
                ? vulnerabilityLevels.find(
                    (level) => level.value === field.value
                  )?.label
                : "Select vulnerability level"}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search vulnerability level..." />
            <CommandEmpty>No level found.</CommandEmpty>
            <CommandGroup>
              {vulnerabilityLevels.map((level) => (
                <CommandItem
                  value={level.label}
                  key={level.value}
                  onSelect={() => {
                    form.setValue("vulnerabilityLevel", level.value)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      level.value === field.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {level.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <FormDescription>
        Select the appropriate vulnerability level.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="venit"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Venit</FormLabel>
      <FormControl>
        <Input type="number" placeholder="Your venit" {...field} />
      </FormControl>
      <FormDescription>
        Enter your monthly income.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="birthYear"
  render={({ field }) => (
    <FormItem className="flex flex-col">
      <FormLabel>Anul nașterii</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-[200px] justify-between",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value
                ? field.value
                : "Select year"}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search year..." />
            <CommandEmpty>No year found.</CommandEmpty>
            <CommandGroup>
              {years.map((year) => (
                <CommandItem
                  value={year.label}
                  key={year.value}
                  onSelect={() => {
                    form.setValue("birthYear", year.value)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      year.value === field.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {year.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <FormDescription>
        Select your year of birth.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="heatingType"
  render={({ field }) => (
    <FormItem className="flex flex-col">
      <FormLabel>Tip Încălzire principal</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-[200px] justify-between",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value
                ? heatingTypes.find(
                    (type) => type.value === field.value
                  )?.label
                : "Select heating type"}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search heating type..." />
            <CommandEmpty>No heating type found.</CommandEmpty>
            <CommandGroup>
              {heatingTypes.map((type) => (
                <CommandItem
                  value={type.label}
                  key={type.value}
                  onSelect={() => {
                    form.setValue("heatingType", type.value)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      type.value === field.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {type.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <FormDescription>
        Select the main type of heating used.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="compensatedEnergy"
  render={({ field }) => (
    <FormItem className="flex flex-col">
      <FormLabel>Energie Compensată</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-[200px] justify-between",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value
                ? compensatedEnergyOptions.find(
                    (option) => option.value === field.value
                  )?.label
                : "Select energy option"}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search energy option..." />
            <CommandEmpty>No energy option found.</CommandEmpty>
            <CommandGroup>
              {compensatedEnergyOptions.map((option) => (
                <CommandItem
                  value={option.label}
                  key={option.value}
                  onSelect={() => {
                    form.setValue("compensatedEnergy", option.value)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      option.value === field.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <FormDescription>
        Select the compensated energy type.
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>




        <Button type="submit">Predict</Button>
        {apiResponse && (
        <div className="mt-4 rounded border p-4">
          <h3 className="text-lg font-semibold">Response:</h3>
          <pre className="whitespace-pre-wrap text-sm">{apiResponse}</pre>
        </div>
      )}
      </form>
    </Form>
  )
}
