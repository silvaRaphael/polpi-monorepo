import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuShortcut,
  DropdownMenuSeparator
} from "./dropdown"

const Dropdown = Object.assign(DropdownMenu, {
  Trigger: DropdownMenuTrigger,
  Label: DropdownMenuLabel,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  Group: DropdownMenuGroup,
  Shortcut: DropdownMenuShortcut,
  Separator: DropdownMenuSeparator
})

export { Dropdown }
