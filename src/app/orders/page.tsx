"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { OrderType } from "@/config/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from 'sonner'
import Loading from "@/app/loading";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Orders = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders`).then((res) =>
        res.json()
      ),
  });

  if (status === "unauthenticated") {
    toast.error("Kamu belum login, silahkan login terlebih dahulu")
    router.push("/login");
  }

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => {
      return fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(status)
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      toast.success('Success updating status.')
    }
  })

  const handleChange = (e: string) => {
    setSelectedValue(e);
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault()

    mutation.mutate({
      id: id,
      status: selectedValue!
    }, {
      onError: (error) => {
        console.error('Failed to update status:', error);
        toast.error('Failed updating status.');
      }
    })
  }
  console.log({ data });

  if (isLoading || status === "loading") return <Loading />;

  return (
    <MaxWidthWrapper>
      <table className="w-full my-5">
        <thead className="border-b text-left bg-amber-700 text-white">
          <tr className="border-b border-amber-100">
            <th>Order ID</th>
            <th>Date</th>
            <th>Name</th>
            <th>Products</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="border-b border-r ">
          {data.length > 0 && data?.map((item: OrderType) => (
            <tr key={item.id} className={cn(`border-b border-amber-100 align-items-center py-2`, item.status.toLowerCase() != 'delivered' && 'bg-red-100')}>
              <td className="line-clamp-1 max-w-32 items-center">{item.id}</td>
              <td>{item.createdAt.toString().slice(0, 10)} {`${item.createdAt.toString().slice(11, 13)}:${item.createdAt.toString().slice(14, 16)}`}</td>
              <td>{item.user.name}</td>
              <td>{item.products[0].title}{item.products[1] ? `, ${item.products[1].title}` : ''}</td>
              <td>{item.price}</td>
              <td className="min-w-44">
                {
                  session?.user?.isAdmin ? (
                    <form onSubmit={(e) => handleSubmit(e, item.id)} className="flex items-center justify-around">
                      <Select onValueChange={handleChange}>
                        <SelectTrigger>
                          <SelectValue placeholder={item.status} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Prepared">Prepared</SelectItem>
                          <SelectItem value="On Delivery">On Delivery</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                      {/* <select defaultValue={item.status} onChange={handleChange} >
                        <option value={"Prepared"}>Prepared</option>
                        <option value={"Delivered"}>Delivered</option>
                      </select> */}
                      <Button type="submit" size={"sm"} variant={"default"}>Save</Button>
                    </form>
                  )
                    :
                    <span>
                      {item.status}
                    </span>
                }
              </td>
            </tr>
          ))
          }
        </tbody>
      </table>
    </MaxWidthWrapper>
  );
};

export default Orders;
