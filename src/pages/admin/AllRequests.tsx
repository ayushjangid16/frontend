import { RequestTable } from "../../components/requestsTable/request-table";
import { columns, type Request } from "../../components/requestsTable/columns";
import { useEffect } from "react";
import { errorToast, successToast } from "@/components/customToast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "@/store/slices/userSlice";
import { setRequests } from "@/store/slices/requestSlice";

export default function AllRequests() {
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;

  const requestData: Request[] = useSelector(
    (state: any) => state.requestReducer.requests
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchAllRequests = async () => {
    const response = await fetch(`${backendUrl}/request/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
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

    const finalData: Request[] = result.data.map((req) => ({
      status: req.status,
      _id: req._id,
      name: req.user_id.first_name + " " + req.user_id.last_name,
    }));

    dispatch(setRequests(finalData));
    successToast(result.message);
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-4 py-8 px-8">
        <div className="flex flex-col gap-6 py-6 px-6 contain bg-white">
          <h3 className="text-xl font-semibold text-gray-800">
            All Pending Requests
          </h3>
          <RequestTable columns={columns} data={requestData} />
        </div>
      </div>
    </div>
  );
}
