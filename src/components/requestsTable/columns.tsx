import { Button } from "@/components/ui/button";
import { approveRequests, rejectRequest } from "@/store/slices/requestSlice";
import { type ColumnDef } from "@tanstack/react-table";
import { useDispatch } from "react-redux";
import { errorToast, successToast } from "../customToast";
import { removeUser } from "@/store/slices/userSlice";
import { useNavigate } from "react-router-dom";

export type Request = {
  _id: string;
  name: string;
  status: string;
};

const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;

export const columns: ColumnDef<Request>[] = [
  {
    accessorKey: "name",
    header: () => <span className="font-semibold text-gray-700">Name</span>,
    cell: ({ row }) => (
      <span className="text-gray-900 font-medium">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "status",
    header: () => <span className="font-semibold text-gray-700">Status</span>,
    cell: ({ row }) => {
      const status = row.getValue("status") as Request["status"];
      const statusColors = {
        pending: "bg-yellow-100 text-yellow-800",
        accepted: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800",
      };
      return (
        <span
          className={`px-2 py-1 rounded-full text-sm font-semibold ${statusColors[status]}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: () => (
      <div className="text-center font-semibold text-gray-700">Actions</div>
    ),
    cell: ({ row }) => {
      const dispatch = useDispatch();
      const navigate = useNavigate();
      const rowData = row.original;
      const status = rowData.status;

      const handleApprove = async () => {
        const response = await fetch(`${backendUrl}/request/approve`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            requestId: rowData._id,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          errorToast(result.error.message);
          const allMessages = [
            "Invalid or expired token.",
            "Please Provide a Token.",
            "Invalid Token",
          ];
          if (allMessages.includes(result.error.message)) {
            dispatch(removeUser());
            localStorage.clear();
            navigate("/login", { replace: true });
          }
          return;
        }

        successToast("Request Approved");
        dispatch(approveRequests(rowData._id));
      };

      const handleReject = async () => {
        const response = await fetch(`${backendUrl}/request/reject`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            requestId: rowData._id,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          errorToast(result.error.message);
          const allMessages = [
            "Invalid or expired token.",
            "Please Provide a Token.",
            "Invalid Token",
          ];
          if (allMessages.includes(result.error.message)) {
            dispatch(removeUser());
            localStorage.clear();
            navigate("/login", { replace: true });
          }
          return;
        }

        successToast("Request Rejected");
        dispatch(rejectRequest(rowData._id));
      };

      if (status !== "pending") return null;

      return (
        <div className="flex justify-center gap-3">
          <Button
            onClick={handleApprove}
            size="sm"
            variant="default"
            className="min-w-[80px] hover:text-white transition"
          >
            Approve
          </Button>
          <Button
            size="sm"
            onClick={handleReject}
            variant="destructive"
            className="min-w-[80px] hover:text-white transition"
          >
            Reject
          </Button>
        </div>
      );
    },
    enableSorting: false,
    enableColumnFilter: false,
  },
];
