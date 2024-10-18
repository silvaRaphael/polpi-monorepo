import {
  Select as SelectComponent,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
  SelectScrollDownButton,
  SelectScrollUpButton
} from "./select"

const Select = Object.assign(SelectComponent, {
  Trigger: SelectTrigger,
  Value: SelectValue,
  Content: SelectContent,
  Item: SelectItem,
  Group: SelectGroup,
  Label: SelectLabel,
  Separator: SelectSeparator,
  ScrollDownButton: SelectScrollDownButton,
  ScrollUpButton: SelectScrollUpButton
})

export { Select }
