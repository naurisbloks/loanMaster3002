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
import { useLoanStore } from "@/stores/loanStore";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";

const formSchema = z.object({
  itemDetails: z.string().min(1, "Item details are required"),
});

export default function PawnLoanForm() {
  const { createLoan } = useLoanStore();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">{t("loans.pawn.new")}</h1>
            <p className="text-muted-foreground mt-2">
              {t("loans.pawn.itemDetailsDescription")}
            </p>
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
  );
}
