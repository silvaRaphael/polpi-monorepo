export const combineWords = (words: string[]) => {
  return (
    words
      .join(", ")
      // final one should be "e" instead of comma
      .replace(/, ([^,]*)$/, " e $1")
  )
}
