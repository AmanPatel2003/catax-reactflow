"use client"

import Sidebar from '@/components/Sidebar'
import { Background, Controls, ReactFlow, useReactFlow } from '@xyflow/react';
import React, { useCallback, useRef, useState } from 'react'

const Page = () => {
    const reactFlowWrapper = useRef(null);
    const [variant, setVariant] = useState("dots");
    const { screenToFlowPosition } = useReactFlow();
    const [type, bgColor] = useDnD();


const onDrop = useCallback(
  (event) => {
    event.preventDefault();
    if (!type) return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    const newNode = {
      id: getId(),
      type: type,
      position,
      data: { label: `${type} node` },
    };

    setNodes((nds) => nds.concat(newNode));
  },
  [screenToFlowPosition, type]
);



  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full">
        <div className="w-full h-screen" ref={reactFlowWrapper}>
          <ReactFlow
            // nodes={nodes}
            // edges={edges}
            // onNodeClick={onNodeClick}
            // onEdgeClick={onEdgeClick} // Add edge click handler
            // onNodesChange={onNodesChange}
            // onEdgesChange={onEdgesChange}
            // onConnect={onConnect}
            onDrop={onDrop}
            // onDragOver={onDragOver}
            fitView
            // nodeTypes={nodeTypes}
            // style={{ background: `${backgroundColor}` }}
            className="custom-flow"
            elementsSelectable
            panOnDrag
            zoomOnScroll
            zoomOnDoubleClick
          >
            <Controls />
            <Background color="#99b3ec" variant={variant} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default Page