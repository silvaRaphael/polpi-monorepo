import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "./resizable"

const Resizable = Object.assign(ResizablePanelGroup, {
  Panel: ResizablePanel,
  Handle: ResizableHandle
})

export { Resizable }
