import UsersTanstackTable from "@/components/custom/users-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <h1 className="mt-2 mb-3 text-4xl font-extrabold text-cyan-600 [font-variant:small-caps]">
        Admin Dashboard
      </h1>
      <Card className="mx-auto mt-10 mb-20 w-[90%] resize">
        <CardHeader>
          <CardTitle className="text-center text-3xl tracking-widest text-transparent [font-variant:small-caps]">
            <p className="bg-linear-to-br from-red-500 via-orange-300 to-yellow-300 bg-clip-text text-center text-shadow-md">
              Users List
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTanstackTable />
        </CardContent>
      </Card>
    </div>
  );
}

