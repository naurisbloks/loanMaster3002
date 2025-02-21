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

const formSchema = z.object({
  itemDetails: z.string().min(1, "Item details are required"),
});

export default function PawnLoanForm() {
  const { createLoan } = useLoanStore();
  const { clients, fetchClients } = useClientStore();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemDetails: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createLoan({
        type: "pawn",
        itemDetails: values.itemDetails,
      });
      setLocation("/loans"); // Redirect to loans page after successful submission
    } catch (error) {
      console.error("Failed to create pawn loan:", error);
    }
  }

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

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold">{t("loans.pawn.new")}</h1>
              <p className="text-muted-foreground mt-2">
                {t("loans.pawn.itemDetailsDescription")}
              </p>
            </div>

            <div className="flex items-center gap-4">
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
              {selectedClient && (
                <p className="text-sm text-muted-foreground">
                  {selectedClient.firstName} {selectedClient.lastName}
                </p>
              )}
            </div>

            <FormField
              control={form.control}
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

          <Button
            type="submit"
            className="w-full md:w-auto md:min-w-[200px] h-12"
            size="lg"
          >
            {t("loans.pawn.submit")}
          </Button>
        </form>
      </Form>

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
    </>
  );
}