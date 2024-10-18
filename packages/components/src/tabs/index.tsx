import {
  Tabs as TabsComponent,
  TabsContent,
  TabsList,
  TabsTrigger
} from "./tabs"

const Tabs = Object.assign(TabsComponent, {
  Content: TabsContent,
  List: TabsList,
  Trigger: TabsTrigger
})

export { Tabs }
