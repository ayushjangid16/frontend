import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconBell } from "@tabler/icons-react";

export default function NotificationBell() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="relative flex items-center justify-center rounded-full p-2 shadow-sm hover:shadow-md transition"
        >
          <IconBell className="h-6 w-6 text-gray-700" />
          {/* Optional notification dot */}
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="mr-6 w-80 max-h-80 overflow-auto mt-2 rounded-xl shadow-lg border border-gray-200">
        <div className="flex flex-col gap-4 p-4">
          <h4 className="text-lg font-semibold text-gray-900">Notifications</h4>

          {/* Notification Item */}
          {[
            { title: "New order received", time: "5 min ago" },
            { title: "Payment processed", time: "10 min ago" },
            { title: "Item shipped", time: "1 hour ago" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex gap-3 items-start border-b last:border-none pb-3"
            >
              <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-800">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500">{item.time}</p>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            className="w-full mt-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
          >
            Mark All as Read
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
