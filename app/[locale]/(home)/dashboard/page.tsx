
"use client"
import {
  Step,
  Stepper,
  useStepper,
  type StepItem,
} from "@/components/stepper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
const steps = [
  { label: "Step 1" },
  { label: "Step 2" },
  { label: "Step 3" },
] satisfies StepItem[]

export default function StepperDemo() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Stepper initialStep={0} steps={steps}>
        {steps.map(({ label }, index) => {
          return (
            <Step key={label} label={label}>
              <div className="h-40 flex items-center justify-center my-4 border bg-secondary text-primary rounded-md">
                {index===0?(  <div className="grid gap-4 py-4">
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor="name" className="text-right">
      Name
    </Label>
    <Input id="name" value="Pedro" className="col-span-3" />
  </div>
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor="birthdate" className="text-right">
      Birthdate
    </Label>
    <Input id="birthdate" value="1990-01-01" type="date" className="col-span-3" />
  </div>
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor="birthplace" className="text-right">
      Birthplace
    </Label>
    <Input id="birthplace" value="Lisbon" className="col-span-3" />
  </div>
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor="school" className="text-right">
      School
    </Label>
    <Input id="school" value="University of Lisbon" className="col-span-3" />
  </div>
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor="year" className="text-right">
      Year
    </Label>
    <Input id="year" value="2024" className="col-span-3" />
  </div>
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor="field" className="text-right">
      Field
    </Label>
    <Input id="field" value="Computer Science" className="col-span-3" />
  </div>
  <div className="grid grid-cols-4 items-center gap-4">
    <Label htmlFor="phoneNumber" className="text-right">
      Phone Number
    </Label>
    <Input id="phoneNumber" value="+351123456789" className="col-span-3" />
  </div>
</div>):(<h1 className="text-xl">Woohoo! All steps completed! 🎉</h1>)}
              </div>
            </Step>
          )
        })}
        <Footer />
      </Stepper>
    </div>
  )
}

const Footer = () => {
  const {
    nextStep,
    prevStep,
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
  } = useStepper()
  return (
    <>
      {hasCompletedAllSteps && (
        <div className="h-40 flex items-center justify-center my-4 border bg-secondary text-primary rounded-md">
          <h1 className="text-xl">Woohoo! All steps completed! 🎉</h1>
        </div>
      )}
      <div className="w-full flex justify-end gap-2">
        {hasCompletedAllSteps ? (
          <Button size="sm" onClick={resetSteps}>
            Reset
          </Button>
        ) : (
          <>
            <Button
              disabled={isDisabledStep}
              onClick={prevStep}
              size="sm"
              variant="secondary"
            >
              Prev
            </Button>
            <Button size="sm" onClick={nextStep}>
              {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
            </Button>
          </>
        )}
      </div>
    </>
  )
}