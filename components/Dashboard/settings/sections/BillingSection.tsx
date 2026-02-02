import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";



const transactions = [
    {
        id: "#36223",
        product: "Mock premium pack",
        status: "Pending",
        date: "12/10/2021",
        amount: "$39.90"
    },
    {
        id: "#34283",
        product: "Business board basic subscription",
        status: "Paid",
        date: "11/13/2021",
        amount: "$59.90"
    },
    {
        id: "#32234",
        product: "Business board basic subscription",
        status: "Paid",
        date: "10/13/2021",
        amount: "$59.90"
    },
    {
        id: "#31354",
        product: "Business board basic subscription",
        status: "Paid",
        date: "09/13/2021",
        amount: "$59.90"
    }
];




export function BillingSection() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-balance">Billing</h1>
            </div>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                <span className="font-semibold text-green-600">⚡</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">Business board basic</h3>
                                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                                        Active
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground text-sm">
                                    Billing monthly | Next payment on 02/09/2025 for{" "}
                                    <span className="font-medium">$59.90</span>
                                </p>
                            </div>
                        </div>
                        <Button>Change plan</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                                <span className="text-xs font-bold text-blue-600">VISA</span>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Carolyn Perkins •••• 0392</span>
                                    <Badge variant="outline" className="text-xs">
                                        Primary
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground text-sm">Expired Dec 2025</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">
                            Edit
                        </Button>
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                                <span className="text-xs font-bold text-orange-600">MC</span>
                            </div>
                            <div>
                                <span className="font-medium">Carolyn Perkins •••• 8461</span>
                                <p className="text-muted-foreground text-sm">Expired Jun 2025</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">
                            Edit
                        </Button>
                    </div>

                    <Button variant="outline" className="w-full bg-transparent">
                        <Plus className="mr-2 h-4 w-4" />
                        Add payment method
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Transaction history</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="text-muted-foreground grid grid-cols-5 gap-4 border-b pb-2 text-sm font-medium">
                            <div>REFERENCE</div>
                            <div>PRODUCT</div>
                            <div>STATUS</div>
                            <div>DATE</div>
                            <div className="text-right">AMOUNT</div>
                        </div>

                        {transactions.map((transaction) => (
                            <div key={transaction.id} className="grid grid-cols-5 gap-4 py-2 text-sm">
                                <div className="font-medium">{transaction.id}</div>
                                <div>{transaction.product}</div>
                                <div>
                                    <Badge
                                        variant={transaction.status === "Paid" ? "default" : "secondary"}
                                        className={
                                            transaction.status === "Paid"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }>
                                        {transaction.status}
                                    </Badge>
                                </div>
                                <div>{transaction.date}</div>
                                <div className="text-right font-medium">{transaction.amount}</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
