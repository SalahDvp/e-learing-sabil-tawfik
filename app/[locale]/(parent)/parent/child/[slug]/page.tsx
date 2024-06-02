
'use client'
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { useTranslations } from "next-intl"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useChildData } from '@/app/[locale]/(parent)/components/childDataProvider';


function ChildPage({ params }: { params: { slug: string} } ): any {
  const {childData} = useChildData()

  const t = useTranslations()
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('general-information')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('this_is_how_others_will_see_your_school')} </p>
      </div>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Student Profile</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="profile-picture">Student Picture</Label>
              <div className="mt-1 flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage alt="Student Avatar" src="/placeholder-avatar.jpg" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <Button size="sm" variant="outline">
                  Change
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="bio">About Samantha</Label>
              <Textarea className="mt-1" id="bio" placeholder="Write a short bio about Samantha..." rows={3} />
            </div>
            <div>
              <Label htmlFor="school">School</Label>
              <Input className="mt-1" id="school" placeholder="Acme Elementary School" />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Input className="mt-1" id="address" placeholder={childData.address} />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input className="mt-1" id="city" placeholder={childData.city} />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input className="mt-1" id="state" placeholder={childData.state} />
            </div>
            <div>
              <Label htmlFor="postal-code">Postal Code</Label>
              <Input className="mt-1" id="postal-code" placeholder={childData.postalCode} />
            </div>
            <div>
              <Label htmlFor="emergency-contact-name">Emergency Contact Name</Label>
              <Input className="mt-1" id="emergency-contact-name" placeholder={childData.emergencyContactName} />
            </div>
            <div>
              <Label htmlFor="emergency-contact-phone">Emergency Contact Phone</Label>
              <Input className="mt-1" id="emergency-contact-phone" placeholder={childData.emergencyContactPhone} />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="data-level">Data Level</Label>
              <Input className="mt-1" id="data-level" placeholder={childData.level} />
            </div>
            <div>
              <Label htmlFor="class">Class</Label>
              <Input className="mt-1" id="class" placeholder={childData.class} />
            </div>
            <div>
              <Label htmlFor="date-of-birth">Date of Birth</Label>
              <Input className="mt-1" id="date-of-birth" type="date" placeholder={childData.dateOfBirth} />
            </div>
            <div>
              <Label htmlFor="medical-conditions">Medical Conditions</Label>
              <Textarea
                className="mt-1"
                id="medical-conditions"
                placeholder={childData.medicalConditions}
                rows={3} />
            </div>
            <div>
              <Label htmlFor="joining-date">Joining Date</Label>
              <Input className="mt-1" id="joining-date" placeholder={childData.joiningDate}  /> 
            </div>
            <div>
              <Label htmlFor="parent-name">Parent/Guardian Name</Label>
              <Input className="mt-1" id="parent-name" placeholder={childData.parentLastName} />
            </div>
            <div>
              <Label htmlFor="parent-email">Parent/Guardian Email</Label>
              <Input className="mt-1" id="parent-email" placeholder={childData.parentEmail} type="email" />
            </div>
            <div>
              <Label htmlFor="parent-phone">Parent/Guardian Phone</Label>
              <Input className="mt-1" id="parent-phone" placeholder={childData.parentPhone} />
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

  export default ChildPage;
