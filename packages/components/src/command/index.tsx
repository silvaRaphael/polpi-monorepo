import {
  Command as CommandComponent,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
  CommandSeparator,
  CommandShortcut
} from "./command"

const Command = Object.assign(CommandComponent, {
  Dialog: CommandDialog,
  Empty: CommandEmpty,
  Group: CommandGroup,
  Input: CommandInput,
  List: CommandList,
  Item: CommandItem,
  Separator: CommandSeparator,
  Shortcut: CommandShortcut
})

export { Command }
