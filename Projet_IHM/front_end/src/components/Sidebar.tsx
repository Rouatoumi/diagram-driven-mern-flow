import { Link, useLocation } from "react-router-dom";
import { 
  PlusCircle, 
  List, 
  Clock, 
  Filter, 
  Gavel, 
  Package,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    name: "Dashboard",
    icon: Home,
    href: "/dashboard"
  },
  {
    name: "Add New Post",
    icon: PlusCircle,
    href: "/new_post"
  },
  {
    name: "My Posts",
    icon: Package,
    href: "/my_posts"
  },
  {
    name: "Bidding History",
    icon: Gavel,
    href: "/bids/history"
  },
  {
    name: "Browse Posts",
    icon: Filter,
    href: "/auctions"
  },
  {
    name: "Ongoing Bids",
    icon: Clock,
    href: "/bids/ongoing"
  }
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r bg-white">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto">
        <div className="flex-grow px-4 pb-4">
          <nav className="flex-1 space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "group flex items-center px-4 py-3 text-sm font-medium rounded-md",
                  location.pathname.startsWith(item.href)
                    ? "bg-pink-50 text-pink-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5",
                    location.pathname.startsWith(item.href)
                      ? "text-pink-500"
                      : "text-gray-400 group-hover:text-gray-500"
                  )}
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}