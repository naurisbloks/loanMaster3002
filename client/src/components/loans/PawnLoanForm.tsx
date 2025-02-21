import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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
import { useLoanStore } from "@/stores/loanStore";
import { useClientStore } from "@/stores/clientStore";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Client } from "@/types";
import ClientDetails from "@/components/clients/ClientDetails";

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

  async function onSubmitStep1(values: z.infer<typeof itemDetailsSchema>) {
    setCurrentStep(2);
  }

  async function onSubmitStep2(values: z.infer<typeof deviceDetailsSchema>) {
    try {
      await createLoan({
        type: "pawn",
        ...values,
        itemDetails: itemDetailsForm.getValues().itemDetails,
      });
      setCurrentStep(3);
    } catch (error) {
      console.error("Failed to submit device details:", error);
    }
  }

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
              size="sm"
              onClick={handleRemoveClient}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              {t("loans.pawn.removeClient")}
            </Button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <>
      {currentStep === 1 && (
        <Form {...itemDetailsForm}>
          <form onSubmit={itemDetailsForm.handleSubmit(onSubmitStep1)} className="space-y-8">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{t("loans.pawn.new")} - Step 1 of 4</h1>
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
                <h1 className="text-2xl font-bold">{t("loans.pawn.new")} - Step 2 of 4</h1>
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

      {/*Step 3 and 4 would be added here similarly.  This example only shows steps 1 and 2.*/}

      <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
        <SheetContent className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{t("loans.pawn.searchClient")}</SheetTitle>
            <SheetDescription>
              {t("loans.pawn.searchPlaceholder")}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <Input
              placeholder={t("loans.pawn.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4"
            />
            <div className="space-y-2">
              {filteredClients.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t("loans.pawn.noClientsFound")}
                </p>
              ) : (
                filteredClients.map((client) => (
                  <Button
                    key={client.id}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => handleClientSelect(client)}
                  >
                    <div>
                      <p className="font-medium">
                        {client.firstName} {client.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {client.email} • {client.phone}
                      </p>
                    </div>
                  </Button>
                ))
              )}
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
    </>
  );
}