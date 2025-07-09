import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast, Toaster } from "sonner";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Truck,
  Clock,
  DollarSign,
  Settings,
  Shield,
  Camera,
  CheckCircle,
  AlertCircle,
  Upload,
} from "lucide-react";

const AgentProfile = () => {
  const [profileData, setProfileData] = useState({
    // Personal Information
    fullName: "Rajesh Patel",
    email: "rajesh.patel@wasteagent.lk",
    mobile: "+94 77 123 4567",
    nicOrRegistration: "123456789V",
    profilePicture: "",
    preferredLanguage: "English",
    
    // Business Information
    companyName: "EcoWaste Solutions Pvt Ltd",
    serviceType: "Organic Waste Collection",
    serviceLicense: "WM-2024-001234",
    yearsExperience: "5",
    
    // Location Information
    address: "123 Green Valley Road, Colombo 07",
    district: "Colombo",
    province: "Western",
    serviceCoverageRadius: "25",
    gpsPickupRange: "30",
    willingToTravel: true,
    
    // Service Details
    vehicleType: "Small Truck",
    maxDailyCapacity: "2500",
    wasteTypesAccepted: ["Organic Waste", "Agricultural Residue", "Food Waste"],
    availablePickupDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    availableTimeSlots: ["Morning (8AM-12PM)", "Afternoon (1PM-5PM)"],
    
    // Financial Information
    incentiveParticipation: true,
    preferredPaymentMethod: "Bank Transfer",
    bankName: "Commercial Bank of Ceylon",
    accountNumber: "****-****-****-1234",
    accountHolderName: "Rajesh Patel",
    willingToOfferIncentive: true,
    incentiveRatePerKg: "0.05",
    
    // Preferences
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    messagingAvailability: true,
    darkModePreference: false,
    
    // Verification Status
    emailVerified: true,
    mobileVerified: true,
    documentVerified: false,
  });

  const provinces = [
    "Western", "Central", "Southern", "Northern", "Eastern",
    "North Western", "North Central", "Uva", "Sabaragamuwa"
  ];

  const districts = [
    "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
    "Galle", "Matara", "Hambantota", "Jaffna", "Batticaloa", "Ampara",
    "Trincomalee", "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa",
    "Badulla", "Monaragala", "Ratnapura", "Kegalle"
  ];

  const wasteTypes = [
    "Organic Waste", "Agricultural Residue", "Food Waste", "Garden Waste",
    "Crop Residue", "Processing Waste", "Coconut Husk", "Tea Waste",
    "Rice Straw", "Vegetable Trimmings", "Fruit Peels"
  ];

  const vehicleTypes = [
    "Motorcycle", "Three Wheeler", "Small Truck", "Medium Truck",
    "Large Truck", "Pickup Truck", "Van", "Tractor"
  ];

  const timeSlots = [
    "Early Morning (6AM-9AM)", "Morning (8AM-12PM)", "Afternoon (1PM-5PM)",
    "Evening (5PM-8PM)", "Night (8PM-11PM)"
  ];

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  const languages = ["English", "Sinhala", "Tamil"];

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value, isChecked) => {
    setProfileData(prev => ({
      ...prev,
      [field]: isChecked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleSaveProfile = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      }),
      {
        loading: "Saving profile information...",
        success: {
          message: "Profile updated successfully!",
          description: "Your profile information has been saved and will be reviewed."
        },
        error: "Failed to save profile. Please try again."
      }
    );
  };

  const handleResetChanges = () => {
    // Reset to original values or refetch from API
    toast.info("Changes reset", {
      description: "All unsaved changes have been discarded."
    });
  };

  const handleVerifyDocument = () => {
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          setProfileData(prev => ({ ...prev, documentVerified: true }));
          resolve();
        }, 3000);
      }),
      {
        loading: "Verifying documents...",
        success: {
          message: "Documents verified successfully!",
          description: "Your ID and certificates have been verified."
        },
        error: "Document verification failed. Please try again."
      }
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-0">
      <Toaster
        position="bottom-right"
        richColors
        toastOptions={{
          classNames: {
            title: "font-semibold text-sm leading-tight",
            description: "text-xs mt-0.5 leading-relaxed opacity-90",
          },
        }}
      />

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Agent Profile & Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your profile information, service details, and account preferences
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100">Complete Your Profile</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                A complete profile helps farmers find and trust your services. Ensure all required fields are filled and documents are verified.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-xl gap-1">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profileData.profilePicture} />
                <AvatarFallback className="text-lg">
                  {profileData.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
                <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={profileData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                  {profileData.emailVerified ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number *</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="mobile"
                    value={profileData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                  />
                  {profileData.mobileVerified ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nicOrRegistration">NIC or Business Registration *</Label>
                <Input
                  id="nicOrRegistration"
                  value={profileData.nicOrRegistration}
                  onChange={(e) => handleInputChange('nicOrRegistration', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredLanguage">Preferred Language</Label>
                <Select 
                  value={profileData.preferredLanguage}
                  onValueChange={(value) => handleInputChange('preferredLanguage', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex text-xl items-center gap-2">
              <Shield className="h-5 w-5" />
              Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Verification</span>
                <Badge variant={profileData.emailVerified ? "default" : "secondary"}>
                  {profileData.emailVerified ? "Verified" : "Pending"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Mobile OTP Verification</span>
                <Badge variant={profileData.mobileVerified ? "default" : "secondary"}>
                  {profileData.mobileVerified ? "Verified" : "Pending"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Document Verification</span>
                <Badge variant={profileData.documentVerified ? "default" : "destructive"}>
                  {profileData.documentVerified ? "Verified" : "Required"}
                </Badge>
              </div>
            </div>
            {!profileData.documentVerified && (
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={handleVerifyDocument}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
                <p className="text-xs text-gray-500">
                  Upload your ID and service certificates for verification
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Business Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex text-xl items-center gap-2">
              <Building className="h-5 w-5" />
              Business Information
            </CardTitle>
            <CardDescription>
              Your company details and service credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company/Organization Name</Label>
                <Input
                  id="companyName"
                  value={profileData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceType">Type of Waste Management Service</Label>
                <Input
                  id="serviceType"
                  value={profileData.serviceType}
                  onChange={(e) => handleInputChange('serviceType', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceLicense">Service License or Certifications</Label>
                <Input
                  id="serviceLicense"
                  value={profileData.serviceLicense}
                  onChange={(e) => handleInputChange('serviceLicense', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearsExperience">Years of Experience</Label>
                <Input
                  id="yearsExperience"
                  type="number"
                  value={profileData.yearsExperience}
                  onChange={(e) => handleInputChange('yearsExperience', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card className="gap-3">
          <CardHeader>
            <CardTitle className="flex text-xl items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payment & Incentives
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="incentiveParticipation">Incentive Scheme Participation</Label>
                <Switch
                  id="incentiveParticipation"
                  checked={profileData.incentiveParticipation}
                  onCheckedChange={(checked) => handleInputChange('incentiveParticipation', checked)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredPaymentMethod">Preferred Payment Method</Label>
                <Select
                  value={profileData.preferredPaymentMethod}
                  onValueChange={(value) => handleInputChange('preferredPaymentMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Mobile Wallet">Mobile Wallet</SelectItem>
                    <SelectItem value="Check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={profileData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  value={profileData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  placeholder="Enter your bank account number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountHolderName">Account Holder Name</Label>
                <Input
                  id="accountHolderName"
                  value={profileData.accountHolderName}
                  onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                  placeholder="Name as per bank records"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="willingToOfferIncentive">Willing to offer incentive per kg</Label>
                <Switch
                  id="willingToOfferIncentive"
                  checked={profileData.willingToOfferIncentive}
                  onCheckedChange={(checked) => handleInputChange('willingToOfferIncentive', checked)}
                />
              </div>
              {profileData.willingToOfferIncentive && (
                <div className="space-y-2">
                  <Label htmlFor="incentiveRatePerKg">Incentive Rate per kg ($)</Label>
                  <Input
                    id="incentiveRatePerKg"
                    type="number"
                    step="0.01"
                    value={profileData.incentiveRatePerKg}
                    onChange={(e) => handleInputChange('incentiveRatePerKg', e.target.value)}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex text-xl items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location & Service Area
            </CardTitle>
            <CardDescription>
              Your address and service coverage details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Current Address</Label>
              <Textarea
                id="address"
                value={profileData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Select
                  value={profileData.district}
                  onValueChange={(value) => handleInputChange('district', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map(district => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <Select
                  value={profileData.province}
                  onValueChange={(value) => handleInputChange('province', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map(province => (
                      <SelectItem key={province} value={province}>{province}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceCoverageRadius">Service Coverage Radius (km)</Label>
                <Input
                  id="serviceCoverageRadius"
                  type="number"
                  value={profileData.serviceCoverageRadius}
                  onChange={(e) => handleInputChange('serviceCoverageRadius', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gpsPickupRange">GPS-based Pickup Range (km)</Label>
                <Input
                  id="gpsPickupRange"
                  type="number"
                  value={profileData.gpsPickupRange}
                  onChange={(e) => handleInputChange('gpsPickupRange', e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="willingToTravel">Willing to travel for pickups</Label>
                <Switch
                  id="willingToTravel"
                  checked={profileData.willingToTravel}
                  onCheckedChange={(checked) => handleInputChange('willingToTravel', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex text-xl items-center gap-2">
              <Truck className="h-5 w-5" />
              Service Details
            </CardTitle>
            <CardDescription>
              Your vehicle information and service capacity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Select
                  value={profileData.vehicleType}
                  onValueChange={(value) => handleInputChange('vehicleType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDailyCapacity">Maximum Daily Pickup Capacity (kg)</Label>
                <Input
                  id="maxDailyCapacity"
                  type="number"
                  value={profileData.maxDailyCapacity}
                  onChange={(e) => handleInputChange('maxDailyCapacity', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Waste Types Accepted</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {wasteTypes.map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={profileData.wasteTypesAccepted.includes(type)}
                      onCheckedChange={(checked) => handleArrayChange('wasteTypesAccepted', type, checked)}
                    />
                    <Label htmlFor={type} className="text-sm">{type}</Label>
                  </div>
                ))}
              </div>
              {profileData.wasteTypesAccepted.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {profileData.wasteTypesAccepted.map(type => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Availability & Preferences */}
        <Card className="gap-2">
          <CardHeader>
            <CardTitle className="flex text-xl items-center gap-2">
              <Clock className="h-5 w-5" />
              Availability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className='text-gray-500'>Available Pickup Days</div>
              <div className="space-y-1">
                {daysOfWeek.map(day => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={profileData.availablePickupDays.includes(day)}
                      onCheckedChange={(checked) => handleArrayChange('availablePickupDays', day, checked)}
                    />
                    <Label htmlFor={day} className="text-sm">{day}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className='text-gray-500'>Available Time Slots</div>
              <div className="space-y-2">
                {timeSlots.map(slot => (
                  <div key={slot} className="flex items-center space-x-2">
                    <Checkbox
                      id={slot}
                      checked={profileData.availableTimeSlots.includes(slot)}
                      onCheckedChange={(checked) => handleArrayChange('availableTimeSlots', slot, checked)}
                    />
                    <Label htmlFor={slot} className="text-sm">{slot}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex text-xl items-center gap-2">
              <Settings className="h-5 w-5" />
              Preferences & Notifications
            </CardTitle>
            <CardDescription>
              Manage your notification settings and app preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <Switch
                  id="emailNotifications"
                  checked={profileData.emailNotifications}
                  onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="smsNotifications">SMS Notifications</Label>
                <Switch
                  id="smsNotifications"
                  checked={profileData.smsNotifications}
                  onCheckedChange={(checked) => handleInputChange('smsNotifications', checked)}
                />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="pushNotifications">Push Notifications</Label>
                <Switch
                  id="pushNotifications"
                  checked={profileData.pushNotifications}
                  onCheckedChange={(checked) => handleInputChange('pushNotifications', checked)}
                />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="messagingAvailability">Messaging Availability</Label>
                <Switch
                  id="messagingAvailability"
                  checked={profileData.messagingAvailability}
                  onCheckedChange={(checked) => handleInputChange('messagingAvailability', checked)}
                />
              </div>
            </div>
            <div className="flex items-center gap-4 max-w-md">
              <Label htmlFor="darkModePreference">Dark Mode</Label>
              <Switch
                id="darkModePreference"
                checked={profileData.darkModePreference}
                onCheckedChange={(checked) => handleInputChange('darkModePreference', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="outline" onClick={handleResetChanges}>
          Reset Changes
        </Button>
        <Button onClick={handleSaveProfile} className="min-w-[120px]">
          Save Profile
        </Button>
      </div>
    </div>
  );
};

export default AgentProfile;
