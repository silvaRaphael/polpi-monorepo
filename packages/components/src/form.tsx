import { capitalize, cn } from "@polpi/lib"
import { InputHTMLAttributes, ReactNode, useMemo, useState } from "react"
import { Button } from "./button"
import { Label } from "./label"

export interface InputAttrs extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  capitalize?: boolean
}

export function useForm({ inputAttrs }: { inputAttrs: InputAttrs[] }) {
  const [values, setValues] = useState<Record<string, string>>(
    inputAttrs.reduce(
      (acc, curr) => (
        curr.name ? (acc[curr.name] = String(curr.defaultValue) || "") : null,
        acc
      ),
      {} as Record<string, string>
    )
  )

  return {
    values,
    setValues
  }
}

export function Form({
  className,
  title,
  description,
  inputAttrs,
  values: defaultValues,
  setValues: defaultSetValues,
  helpText,
  buttonText = "Salvar alterações",
  disabledTooltip,
  handleSubmit
}: {
  className?: string
  title: string
  description?: string
  inputAttrs: InputAttrs[]
  values?: Record<string, string>
  setValues?: React.Dispatch<React.SetStateAction<Record<string, string>>>
  helpText?: string | ReactNode
  buttonText?: string
  disabledTooltip?: string | ReactNode
  handleSubmit: (data: any) => Promise<any>
}) {
  // const [values, setValues] = useState<Record<string, string>>(
  //   defaultValues
  //     ? defaultValues
  //     : inputAttrs.reduce(
  //         (acc, curr) => (
  //           curr.name
  //             ? (acc[curr.name] = String(curr.defaultValue) || "")
  //             : null,
  //           acc
  //         ),
  //         {} as Record<string, string>
  //       )
  // )

  const valuesState = useState<Record<string, string>>(
    defaultValues
      ? defaultValues
      : inputAttrs.reduce(
          (acc, curr) => (
            curr.name
              ? (acc[curr.name] = String(curr.defaultValue) || "")
              : null,
            acc
          ),
          {} as Record<string, string>
        )
  )

  const { values, setValues } =
    defaultValues && defaultSetValues
      ? useForm({ inputAttrs })
      : (() => {
          const [values, setValues] = valuesState

          return { values, setValues }
        })()

  const [saving, setSaving] = useState(false)
  const saveDisabled = useMemo(() => {
    return (
      saving ||
      !!inputAttrs.filter(
        (inputAttrs) =>
          inputAttrs.required && !values?.[inputAttrs.name as string]
      ).length
    )
  }, [saving, JSON.stringify(values)])

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
          await handleSubmit(values)
        } catch (_) {}
        setSaving(false)
      }}
      className={cn("rounded-lg bg-white", className)}
    >
      <div className="relative flex flex-col space-y-6 p-5 sm:p-10">
        <div className="flex flex-col space-y-3">
          <h2 className="text-xl font-medium">{title}</h2>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
        {inputAttrs.map((inputAttrs, i) => (
          <div key={i}>
            {inputAttrs.label && (
              <Label htmlFor={inputAttrs.name} className="me-3">
                {inputAttrs.label}
              </Label>
            )}
            <input
              {...{ ...inputAttrs, capitalize: undefined }}
              type={inputAttrs.type || "text"}
              disabled={disabledTooltip ? true : false}
              onChange={(e) => {
                const input = e.target as HTMLInputElement
                const { selectionStart, selectionEnd } = input

                const value = inputAttrs.capitalize
                  ? capitalize(e.target.value) ?? e.target.value
                  : e.target.value

                input.value = value

                if (selectionStart !== null && selectionEnd !== null) {
                  // keep cursor position in case value is modified
                  const newPosition =
                    selectionStart + (value.length - input.value.length)
                  input.setSelectionRange(newPosition, newPosition)
                }

                setValues((prev) => ({
                  ...prev,
                  [inputAttrs.name as string]: value
                }))
              }}
              className={cn(
                "w-full max-w-md rounded-md border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm",
                {
                  "cursor-not-allowed bg-gray-100 text-gray-400":
                    disabledTooltip
                }
              )}
            />
          </div>
        ))}
      </div>

      <div
        className={cn(
          "flex items-center justify-between space-x-4 rounded-b-lg border-t border-gray-200 bg-gray-50 p-5 sm:px-10",
          !helpText && "justify-center"
        )}
      >
        {typeof helpText === "string" ? (
          <p
            className="prose-sm prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-gray-700 text-gray-500 transition-colors"
            dangerouslySetInnerHTML={{ __html: helpText || "" }}
          />
        ) : (
          helpText
        )}
        <div className="shrink-0">
          <Button
            text={buttonText}
            loading={saving}
            disabled={saveDisabled}
            disabledTooltip={disabledTooltip}
            variant="accent"
          />
        </div>
      </div>
    </form>
  )
}
