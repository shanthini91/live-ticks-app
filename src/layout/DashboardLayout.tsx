import React from "react";
import { BinanceProvider } from "../context/BinanceSocketContext";
import BinanceGrid from "../components/BinanceGrid";
import CandlestickChart from "../chart/CandlestickChart";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Tab } from "@headlessui/react";
import UserHistory from "../components/UserHistory";
import Footer from "../components/Footer";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-x-hidden custom-scrollbar bg-gray-700 text-white">
      <div className="px-1">
         <Navbar />
      </div>

      <BinanceProvider>
        <div className="flex flex-row justify-between p-1 gap-1">
          {/* Live ticks grid */}
          <div className="flex-1 overflow-hidden h-[450px] bg-gray-800 shadow-md p-1">
            <Outlet />
          </div>

          {/* Candlestick chart */}
          <div className="flex flex-row justify-between bg-gray-800  w-[600px] h-[450px]  shadow-md p-2">
            <Tab.Group className="flex-1 flex flex-col">
              {/* Tabs */}
              <Tab.List className="flex space-x-2 bg-gray-800 p-2">
                <Tab
                  className={({ selected }) =>
                    classNames(
                      "w-full py-2.5 text-sm font-medium leading-5 text-black",
                      selected
                        ? "bg-yellow-400 shadow"
                        : "text-gray-200 hover:bg-yellow-400 hover:text-black"
                    )
                  }
                >
                  Live Ticks
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      "w-full py-2.5 text-sm font-medium leading-5 text-black",
                      selected
                        ? "bg-yellow-400 shadow"
                        : "text-gray-200 hover:bg-yellow-400 hover:text-black"
                    )
                  }
                >
                  Live Chart
                </Tab>
              </Tab.List>

              {/* Tab Panels */}
              <Tab.Panels className="flex-1 overflow-y-auto bg-gray-800 shadow-md p-2 rounded-b-lg">
                <Tab.Panel>
                  <BinanceGrid />
                </Tab.Panel>
                <Tab.Panel>
                  <CandlestickChart />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </BinanceProvider>
      <div className="px-1">
        <UserHistory />
      </div>
    </div>
  );
};

export default Dashboard;
