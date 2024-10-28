import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuShortcut,
  DropdownMenuSeparator,
  DropdownMenuSubItem,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from "./dropdown"

const Dropdown = Object.assign(DropdownMenu, {
  Trigger: DropdownMenuTrigger,
  Label: DropdownMenuLabel,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  Group: DropdownMenuGroup,
  Shortcut: DropdownMenuShortcut,
  Separator: DropdownMenuSeparator,
  Sub: DropdownMenuSubItem,
  SubTrigger: DropdownMenuSubTrigger,
  SubContent: DropdownMenuSubContent
})

export { Dropdown }
