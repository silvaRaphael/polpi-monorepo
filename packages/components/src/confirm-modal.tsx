import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { Modal } from "./modal"
import { Button } from "./button"
import { useMediaQuery } from "@polpi/hooks"

export function ConfirmModal({
  trigger,
  showModal,
  setShowModal,
  action = "ação",
  description,
  handleConfirm,
  validateInput
}: {
  trigger?: React.ReactNode
  showModal?: boolean
  setShowModal?: React.Dispatch<React.SetStateAction<boolean>>
  action?: string
  description?: string
  handleConfirm: (e: React.FormEvent<HTMLFormElement>) => Promise<any>
  validateInput?: boolean
}) {
  const navigate = useNavigate()

  const [confirming, setConfirming] = useState<boolean>(false)

  const { isMobile } = useMediaQuery()

  return (
    <Modal
      showModal={showModal}
      setShowModal={setShowModal}
      trigger={trigger}
      className="max-w-sm"
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 text-center sm:px-10">
        <h3 className="text-lg font-medium">Confirmar {action}</h3>
        <p className="text-sm text-gray-500">
          {description ||
            `Cuidado: Confirmando esta ${action}, isso pode ser permanente e não ser possível a reversão. Prossiga com precaução.`}
        </p>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          setConfirming(true)
          try {
            await handleConfirm(e)
          } catch (_) {}
          setConfirming(false)
          if (setShowModal) {
            setShowModal(false)
          } else {
            navigate(-1)
          }
        }}
        className="flex flex-col space-y-3 bg-gray-50 px-4 p-5 text-left sm:px-10"
      >
        {validateInput && (
          <div>
            <label
              htmlFor="verification"
              className="block text-sm text-gray-700"
            >
              Para verificar, digite{" "}
              <span className="font-semibold">confirmar</span> abaixo
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type="text"
                pattern="confirmar"
                placeholder="confirmar"
                required
                autoFocus={!isMobile}
                autoComplete="off"
                className="block w-full rounded-md border-gray-300 text-gray-900 placeholder-gray-300 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
              />
            </div>
          </div>
        )}

        <Button
          variant="danger"
          text={`Confirmar ${action}`}
          className="font-bold"
          loading={confirming}
        />
      </form>
    </Modal>
  )
}
