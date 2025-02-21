import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useLoanStore } from "@/stores/loanStore";
import { useClientStore } from "@/stores/clientStore";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Client } from "@/types";
import ClientDetails from "@/components/clients/ClientDetails";
import { useValuationStore } from "@/stores/valuationStore";
import { InfoIcon } from "lucide-react";
import { format } from 'date-fns';
import CreateClientForm from "@/components/clients/CreateClientForm";

const itemDetailsSchema = z.object({
  itemDetails: z.string().min(1, "Item details are required"),
});

const deviceDetailsSchema = z.object({
  type: z.string().min(1, "Device type is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  model: z.string().min(1, "Model is required"),
  color: z.string().min(1, "Color is required"),
  screenSize: z.string().optional(),
  ram: z.string().optional(),
  camera: z.string().optional(),
  simCards: z.string().optional(),
  hdd: z.string().optional(),
});

const accessoriesSchema = z.object({
  hasCharger: z.boolean(),
  hasOtherAccessories: z.boolean(),
  accessoriesDescription: z.string().optional().or(z.string().min(1, "Please describe the accessories")),
});

const picturesSchema = z.object({
  images: z.array(z.instanceof(File)).min(1, "At least one image is required"),
});

export default function PawnLoanForm() {
  const { createLoan } = useLoanStore();
  const { clients, fetchClients } = useClientStore();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientDetailsOpen, setClientDetailsOpen] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const {
    internalValuation,
    externalValuation,
    recommendedValuation,
    finalValue,
    similarDevices,
    scrapedItems,
    internalValuationOpen,
    externalValuationOpen,
    setFinalValue,
    setInternalValuationOpen,
    setExternalValuationOpen,
  } = useValuationStore();
  const [clientCreateOpen, setClientCreateOpen] = useState(false);

  const itemDetailsForm = useForm<z.infer<typeof itemDetailsSchema>>({
    resolver: zodResolver(itemDetailsSchema),
    defaultValues: {
      itemDetails: "",
    },
  });

  const deviceDetailsForm = useForm<z.infer<typeof deviceDetailsSchema>>({
    resolver: zodResolver(deviceDetailsSchema),
    defaultValues: {
      type: "",
      manufacturer: "",
      model: "",
      color: "",
      screenSize: "",
      ram: "",
      camera: "",
      simCards: "",
      hdd: "",
    },
  });

  const accessoriesForm = useForm<z.infer<typeof accessoriesSchema>>({
    resolver: zodResolver(accessoriesSchema),
    defaultValues: {
      hasCharger: false,
      hasOtherAccessories: false,
      accessoriesDescription: "",
    },
  });

  const picturesForm = useForm<z.infer<typeof picturesSchema>>({
    resolver: zodResolver(picturesSchema),
    defaultValues: {
      images: [],
    },
  });

  useEffect(() => {
    return () => {
      imagePreviews.forEach(URL.revokeObjectURL);
    };
  }, [imagePreviews]);

  async function onSubmitStep1(values: z.infer<typeof itemDetailsSchema>) {
    setCurrentStep(2);
  }

  async function onSubmitStep2(values: z.infer<typeof deviceDetailsSchema>) {
    try {
      setCurrentStep(3);
    } catch (error) {
      console.error("Failed to submit device details:", error);
    }
  }

  async function onSubmitStep3(values: z.infer<typeof accessoriesSchema>) {
    try {
      setCurrentStep(4);
    } catch (error) {
      console.error("Failed to submit accessories details:", error);
    }
  }

  async function onSubmitStep4(values: z.infer<typeof picturesSchema>) {
    try {
      setCurrentStep(5);
    } catch (error) {
      console.error("Failed to submit pictures:", error);
    }
  }

  const handleSubmitApplication = async () => {
    try {
      if (!selectedClient || finalValue === null) {
        return;
      }

      const loanData = {
        amount: finalValue,
        term: 12, // Default term
        interestRate: 5, // Default interest rate
        type: "pawn" as const,
        status: "pending" as const,
        itemDetails: itemDetailsForm.getValues().itemDetails,
        deviceDetails: deviceDetailsForm.getValues(),
        accessories: accessoriesForm.getValues(),
        images: picturesForm.getValues().images,
        clientId: selectedClient.id,
        valuations: {
          internal: internalValuation,
          external: externalValuation,
          recommended: recommendedValuation,
          final: finalValue
        }
      };

      await createLoan(loanData);
      setLocation("/applications"); // Redirect to applications page
    } catch (error) {
      console.error("Failed to create loan application:", error);
    }
  };

  const handleCancel = () => {
    setLocation("/loans");
  };

  const filteredClients = clients.filter((client) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      client.firstName.toLowerCase().includes(searchLower) ||
      client.lastName.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.phone.toLowerCase().includes(searchLower)
    );
  });

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setSearchOpen(false);
  };

  const handleClientUpdate = (updatedClient: Client) => {
    setSelectedClient(updatedClient);
  };

  const handleRemoveClient = () => {
    setSelectedClient(null);
  };

  const ClientInfoCard = () => (
    selectedClient && (
      <div className="p-4 mb-6 border rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div>
              <span className="font-medium">{selectedClient.firstName} {selectedClient.lastName}</span>
            </div>
            <div>
              <span className="text-muted-foreground">{selectedClient.email}</span>
            </div>
            <div>
              <span className="text-muted-foreground">{selectedClient.phone}</span>
            </div>
            <div>
              <span className="text-muted-foreground">{selectedClient.address}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setClientDetailsOpen(true)}
            >
              View Details
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemoveClient}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              title={t("loans.pawn.removeClient")}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  );

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentImages = picturesForm.getValues().images || [];
    const newPreviews = files.map(file => URL.createObjectURL(file));

    picturesForm.setValue('images', [...currentImages, ...files]);
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleImageRemove = (index: number) => {
    const currentImages = picturesForm.getValues().images;
    const newImages = currentImages.filter((_, i) => i !== index);

    URL.revokeObjectURL(imagePreviews[index]);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    picturesForm.setValue('images', newImages);
    setImagePreviews(newPreviews);
  };

  const handleClientCreated = (client: Client) => {
    setSelectedClient(client);
    setClientCreateOpen(false);
  };

  return (
    <>
      {currentStep === 1 && (
        <Form {...itemDetailsForm}>
          <form onSubmit={itemDetailsForm.handleSubmit(onSubmitStep1)} className="space-y-8">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{t("loans.pawn.new")} - Step 1 of 5</h1>
                <p className="text-muted-foreground mt-2">
                  {t("loans.pawn.itemDetailsDescription")}
                </p>
              </div>

              <ClientInfoCard />

              <FormField
                control={itemDetailsForm.control}
                name="itemDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">
                      {t("loans.pawn.itemDetails")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t("loans.pawn.itemDetailsDescription")}
                        className="min-h-[200px] resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between items-center">
              <Button
                type="submit"
                className="w-full md:w-auto md:min-w-[200px] h-12"
                size="lg"
              >
                Continue to Step 2
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  fetchClients();
                  setSearchOpen(true);
                }}
              >
                {t("loans.pawn.addClient")}
              </Button>
            </div>
          </form>
        </Form>
      )}

      {currentStep === 2 && (
        <Form {...deviceDetailsForm}>
          <form onSubmit={deviceDetailsForm.handleSubmit(onSubmitStep2)} className="space-y-8">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{t("loans.pawn.new")} - Step 2 of 5</h1>
                <p className="text-muted-foreground mt-2">
                  Please provide detailed information about the device
                </p>
              </div>

              <ClientInfoCard />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={deviceDetailsForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Device Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Smartphone, Laptop" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={deviceDetailsForm.control}
                  name="manufacturer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Manufacturer</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Apple, Samsung" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={deviceDetailsForm.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. iPhone 13, Galaxy S21" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={deviceDetailsForm.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Space Gray, Midnight Blue" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={deviceDetailsForm.control}
                  name="screenSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Screen Size</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 6.1 inches" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={deviceDetailsForm.control}
                  name="ram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RAM</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 8GB" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={deviceDetailsForm.control}
                  name="camera"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Camera</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 12MP + 12MP Ultra Wide" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={deviceDetailsForm.control}
                  name="simCards"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SIM Cards</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Dual SIM, Single SIM" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={deviceDetailsForm.control}
                  name="hdd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Storage</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 256GB" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Button
                type="submit"
                className="w-full md:w-auto md:min-w-[200px] h-12"
                size="lg"
              >
                Continue to Step 3
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Cancel Application
              </Button>
            </div>
          </form>
        </Form>
      )}

      {currentStep === 3 && (
        <Form {...accessoriesForm}>
          <form onSubmit={accessoriesForm.handleSubmit(onSubmitStep3)} className="space-y-8">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{t("loans.pawn.new")} - Step 3 of 5</h1>
                <p className="text-muted-foreground mt-2">
                  Please provide information about device accessories
                </p>
              </div>

              <ClientInfoCard />

              <div className="space-y-6">
                <FormField
                  control={accessoriesForm.control}
                  name="hasCharger"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Charger</FormLabel>
                        <FormDescription>
                          Does the device come with a charger?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={accessoriesForm.control}
                  name="hasOtherAccessories"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Other Accessories</FormLabel>
                        <FormDescription>
                          Are there any other accessories included?
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {accessoriesForm.watch("hasOtherAccessories") && (
                  <FormField
                    control={accessoriesForm.control}
                    name="accessoriesDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Accessories Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe all included accessories..."
                            className="min-h-[100px] resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Button
                type="submit"
                className="w-full md:w-auto md:min-w-[200px] h-12"
                size="lg"
              >
                Continue to Step 4
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Cancel Application
              </Button>
            </div>
          </form>
        </Form>
      )}

      {currentStep === 4 && (
        <Form {...picturesForm}>
          <form onSubmit={picturesForm.handleSubmit(onSubmitStep4)} className="space-y-8">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{t("loans.pawn.new")} - Step 4 of 5</h1>
                <p className="text-muted-foreground mt-2">
                  Please provide pictures of the item
                </p>
              </div>

              <ClientInfoCard />

              <FormField
                control={picturesForm.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Images</FormLabel>
                    <FormDescription>
                      Add clear photos of the item from different angles
                    </FormDescription>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={preview} className="relative aspect-square">
                          <img
                            src={preview}
                            alt={`Item preview ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 bg-white/80 hover:bg-white/90"
                            onClick={() => handleImageRemove(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="aspect-square flex items-center justify-center border-2 border-dashed rounded-lg hover:border-primary/50 transition-colors">
                        <FormControl>
                          <label className="cursor-pointer w-full h-full flex items-center justify-center">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageAdd}
                              multiple
                            />
                            <Plus className="h-8 w-8 text-muted-foreground" />
                          </label>
                        </FormControl>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between items-center">
              <Button
                type="submit"
                className="w-full md:w-auto md:min-w-[200px] h-12"
                size="lg"
              >
                Continue to Summary
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                Cancel Application
              </Button>
            </div>
          </form>
        </Form>
      )}

      {currentStep === 5 && (
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">{t("loans.pawn.new")} - Step 5 of 5</h1>
            <p className="text-muted-foreground mt-2">
              {t("loans.pawn.summary")}
            </p>
          </div>

          <ClientInfoCard />

          <div className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-2">Item Details</h3>
                <p className="text-sm whitespace-pre-wrap">{itemDetailsForm.getValues().itemDetails}</p>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-2">Device Specifications</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(deviceDetailsForm.getValues())
                    .filter(([, value]) => value)
                    .map(([key, value]) => (
                      <div key={key}>
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        {' '}
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-2">Accessories</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-4">
                    <div>
                      <span className="text-muted-foreground">Charger:</span>
                      {' '}
                      <span className="font-medium">
                        {accessoriesForm.getValues().hasCharger ? "Yes" : "No"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Other:</span>
                      {' '}
                      <span className="font-medium">
                        {accessoriesForm.getValues().hasOtherAccessories ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                  {accessoriesForm.getValues().hasOtherAccessories && (
                    <div>
                      <span className="text-muted-foreground">Description:</span>
                      <p className="mt-1 text-sm whitespace-pre-wrap">
                        {accessoriesForm.getValues().accessoriesDescription}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="font-semibold mb-2">Item Images</h3>
                <div className="grid grid-cols-3 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={preview} className="relative aspect-square">
                      <img
                        src={preview}
                        alt={`Item preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-4">Valuations</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Button
                      variant="ghost"
                      className="w-full justify-between"
                      onClick={() => setInternalValuationOpen(true)}
                    >
                      <div className="text-left">
                        <div className="text-sm text-muted-foreground">Internal Valuation</div>
                        <div className="font-medium">${internalValuation}</div>
                      </div>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>

                  <div>
                    <Button
                      variant="ghost"
                      className="w-full justify-between"
                      onClick={() => setExternalValuationOpen(true)}
                    >
                      <div className="text-left">
                        <div className="text-sm text-muted-foreground">External Valuation</div>
                        <div className="font-medium">${externalValuation}</div>
                      </div>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground">Recommended Value</div>
                    <div className="font-medium text-lg">${recommendedValuation}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Final Value</div>
                  <Input
                    type="number"
                    value={finalValue || ''}
                    onChange={(e) => setFinalValue(e.target.value ? Number(e.target.value) : null)}
                    placeholder="Enter final value"
                    className="text-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <div className="space-y-2">
              <Button
                type="button"
                onClick={handleSubmitApplication}
                className="w-full md:w-auto md:min-w-[200px] h-12"
                size="lg"
                disabled={finalValue === null || !selectedClient}
              >
                Complete Application
              </Button>
              {(!selectedClient || finalValue === null) && (
                <p className="text-sm text-red-500">
                  {!selectedClient && "Please add a client. "}
                  {finalValue === null && "Please set a final value."}
                </p>
              )}
            </div>

            <div className="space-x-2 flex items-center">
              {!selectedClient && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    fetchClients();
                    setSearchOpen(true);
                  }}
                >
                  Add Client
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(1)}
              >
                Edit Application
              </Button>
            </div>
          </div>

          <Sheet open={internalValuationOpen} onOpenChange={setInternalValuationOpen}>
            <SheetContent className="w-full sm:max-w-xl">
              <SheetHeader>
                <SheetTitle>Similar Devices</SheetTitle>
                <SheetDescription>
                  Previously pawned similar devices and their valuations
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {similarDevices.map((device) => (
                  <div key={device.id} className="rounded-lg border p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{device.manufacturer} {device.model}</h4>
                        <p className="text-sm text-muted-foreground">{device.deviceType}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${device.value}</div>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(device.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <Sheet open={externalValuationOpen} onOpenChange={setExternalValuationOpen}>
            <SheetContent className="w-full sm:max-w-xl">
              <SheetHeader>
                <SheetTitle>Market Prices</SheetTitle>
                <SheetDescription>
                  Current market prices for similar devices
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {scrapedItems.map((item) => (
                  <div key={item.id} className="rounded-lg border p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.source}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${item.price}</div>
                        <p className="text-sm text-muted-foreground">{item.condition}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
        <SheetContent className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Select Client</SheetTitle>
            <SheetDescription>
              Search and select a client for the loan application
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />
            <div className="space-y-2">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleClientSelect(client)}
                >
                  <div className="flex flex-col gap-1">
                    <div className="font-medium">
                      {client.firstName} {client.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {client.email}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {client.phone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredClients.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No clients found</p>
                <Button
                  onClick={() => {
                    setSearchOpen(false);
                    setClientCreateOpen(true);
                  }}
                >
                  Create New Client
                </Button>
              </div>
            )}
            <div className="flex justify-center pt-4 border-t">
              <Button
                onClick={() => {
                  setSearchOpen(false);
                  setClientCreateOpen(true);
                }}
                variant="outline"
              >
                Create New Client
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <ClientDetails
        client={selectedClient}
        open={clientDetailsOpen}
        onOpenChange={setClientDetailsOpen}
        onClientUpdate={handleClientUpdate}
      />
      <CreateClientForm
        open={clientCreateOpen}
        onOpenChange={setClientCreateOpen}
        onSuccess={handleClientCreated}
        />
    </>
  );
}