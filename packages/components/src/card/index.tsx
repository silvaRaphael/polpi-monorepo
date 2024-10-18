import {
  Card as CardComponent,
  CardMutedSlim,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent
} from "./card"

const Card = Object.assign(CardComponent, {
  MutedSlim: CardMutedSlim,
  Header: CardHeader,
  Footer: CardFooter,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent
})

export { Card }
