import React, { useState, useEffect, useCallback } from "react";
import ApiService from "../services/ApiService";
import { ProcessingStatus } from "../../shared/common-utils";
import ItemDetailsView, { Item } from "./ItemDetailsView";
import AudioRecorder from "./AudioRecorder";
import { ProcessingItem } from "../../shared/types";
import AppHeader from "./AppHeader";
import AuthService from "../services/AuthService";
import Sidebar from "./Sidebar";

interface MainLayoutProps {
  apiService: ApiService;
  authService: AuthService;
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  apiService,
  authService,
  onLogout,
}) => {
  const [items, setItems] = useState<Record<string, Item>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const loadItems = useCallback(async () => {
    try {
      const allItems = await apiService.getAllItems();
      const itemsRecord: Record<string, Item> = {};
      allItems.forEach((item) => {
        itemsRecord[item.id] = {
          ...item,
          detailsLoaded: false,
        };
      });
      setItems(itemsRecord);
    } catch (error) {
      console.error("Failed to load items:", error);
    }
    setLoading(false);
  }, [apiService]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleItemClick = async (id: string) => {
    if (selectedItem === id) {
      setSelectedItem(null);
      return;
    }

    setSelectedItem(id);
    const item = items[id];

    if (
      !item.detailsLoaded ||
      item.processingStatus === ProcessingStatus.IN_PROGRESS
    ) {
      try {
        const details = await apiService.getItemDetails(id);
        setItems((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            ...details,
            detailsLoaded: true,
          },
        }));
      } catch (error) {
        console.error("Failed to load item details:", error);
      }
    }
  };

  const handleNewUpload = (newItem: ProcessingItem) => {
    setItems((prev) => ({
      [newItem.id]: {
        ...newItem,
        detailsLoaded: false,
      },
      ...prev,
    }));
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <AppHeader
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        authService={authService}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <Sidebar
          items={items}
          loading={loading}
          selectedItem={selectedItem}
          isSidebarOpen={isSidebarOpen}
          onItemClick={handleItemClick}
        />

        <main
          className={`flex-1 overflow-auto p-4 lg:p-8 bg-gray-50 dark:bg-gray-900 transition-all duration-300
                   ${isSidebarOpen ? "lg:ml-0" : "lg:ml-0"}`}
        >
          <div className="max-w-4xl mx-auto">
            {selectedItem ? (
              <ItemDetailsView
                details={items[selectedItem]}
                status={items[selectedItem]?.processingStatus}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 lg:p-8 border border-gray-200 dark:border-gray-700">
                <AudioRecorder
                  apiService={apiService}
                  onUploadSuccess={handleNewUpload}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
