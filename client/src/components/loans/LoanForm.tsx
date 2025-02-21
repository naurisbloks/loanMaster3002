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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLoanStore } from "@/stores/loanStore";
import { useLocation } from "wouter";

const formSchema = z.object({
  type: z.enum(["pawn", "consumer", "retail"]),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  term: z.coerce.number().min(1, "Term must be at least 1 month"),
  interestRate: z.coerce.number().min(0, "Interest rate cannot be negative"),
  purpose: z.string().optional(),
  collateral: z.string().optional(),
});

export default function LoanForm() {
  const { createLoan } = useLoanStore();
  const [, setLocation] = useLocation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "consumer",
      amount: 0,
      term: 12,
      interestRate: 5,
      purpose: "",
      collateral: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createLoan(values);
      setLocation("/loans"); // Redirect to loans page after successful submission
    } catch (error) {
      console.error("Failed to create loan:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Loan Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pawn">Pawn</SelectItem>
                    <SelectItem value="consumer">Consumer</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Loan Amount ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="100"
                    className="h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="term"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Term (months)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="60"
                    className="h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interestRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Interest Rate (%)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    className="h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-8">
          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Purpose (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the purpose of the loan"
                    className="min-h-[100px] resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="collateral"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Collateral (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe any collateral for the loan"
                    className="min-h-[100px] resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full md:w-auto md:min-w-[200px] h-12" size="lg">
          Submit Application
        </Button>
      </form>
    </Form>
  );
}