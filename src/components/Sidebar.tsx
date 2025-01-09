import ProcessingStatusComponent from "./ProcessingStatusComponent";
import { X } from "lucide-react";
import { Item } from "./ItemDetailsView";

interface SidebarProps {
  items: Record<string, Item>;
  loading: boolean;
  selectedItem: string | null;
  isSidebarOpen: boolean;
  onItemClick: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  items,
  loading,
  selectedItem,
  isSidebarOpen,
  onItemClick,
}) => {
  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date
      .toLocaleString("de-DE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        second: "2-digit",
      })
      .replace(/\//g, "-");
  };

  return (
    <aside
      className={`fixed lg:static w-full lg:w-80 bg-white dark:bg-gray-800 shadow-lg flex-shrink-0 transition-all duration-300 ease-in-out transform 
               border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-4rem)]
               ${
                 isSidebarOpen
                   ? "translate-x-0"
                   : "-translate-x-full lg:-translate-x-full"
               }`}
    >
      <div className="p-6">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Processing Items
        </h2>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.values(items)
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((item) => (
                <div
                  key={item.id}
                  onClick={() => onItemClick(item.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200
                    ${
                      selectedItem === item.id
                        ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 shadow-sm"
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700 hover:shadow-sm"
                    }`}
                >
                  <div className="flex justify-between gap-3">
                    <div className="flex-grow">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {formatDateTime(item.createdAt)}
                      </div>
                      <div className="text-sm mt-1">
                        <ProcessingStatusComponent
                          status={item.processingStatus}
                        />
                      </div>
                      {item.transcription && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                          {item.transcription.substring(0, 100)}
                          {item.transcription.length > 100 && "..."}
                        </div>
                      )}
                    </div>
                    <div className="flex items-start gap-2">
                      {item.image && (
                        <img
                          src={`data:image/jpeg;base64,${item.image}`}
                          alt="Generated"
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      )}
                      {selectedItem === item.id && (
                        <X className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
