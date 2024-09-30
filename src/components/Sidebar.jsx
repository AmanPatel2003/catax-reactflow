"use client"

import React from "react";
import { useAppContext } from "./AppContext";

const Sidebar = () => {
  const { setType } = useAppContext()

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <>
      <aside className="w-[20%] max-w-[250px] bg-gray-100 shadow-lg p-4 rounded-lg">
        <h1 className="text-lg font-bold text-gray-700 mb-4">
          You can drag these nodes to the pane on the right.
        </h1>
        <div className="space-y-4">
          <div
            className="bg-blue-500 text-white text-center py-2 px-4 rounded-md cursor-pointer hover:bg-blue-600 transition duration-200"
            onDragStart={(event) => onDragStart(event, "textUpdater")}
            draggable
          >
            Text Updater
          </div>
          <div
            className="bg-green-500 text-white text-center py-2 px-4 rounded-md cursor-pointer hover:bg-green-600 transition duration-200"
            onDragStart={(event) => onDragStart(event, "nodeType2")}
            draggable
          >
            Node Type 2
          </div>
          <div
            className="bg-red-500 text-white text-center py-2 px-4 rounded-md cursor-pointer hover:bg-red-600 transition duration-200"
            onDragStart={(event) => onDragStart(event, "nodeType3")}
            draggable
          >
            Node Type 3
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
