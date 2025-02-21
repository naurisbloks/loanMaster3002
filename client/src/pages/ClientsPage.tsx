import ClientList from "@/components/clients/ClientList";

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
      </div>
      <div className="max-w-[1400px] mx-auto bg-white rounded-lg shadow-lg p-8">
        <ClientList />
      </div>
    </div>
  );
}
