import { cn } from "@comps/lib"
import * as Dialog from "@radix-ui/react-dialog"
import { useNavigate } from "react-router-dom"
import { Dispatch, SetStateAction } from "react"
import { Drawer } from "vaul"
import { useMediaQuery } from "@comps/hooks"
import { LoadingCircle } from "./icons"

export function Modal({
  children,
  className,
  trigger,
  showModal,
  setShowModal,
  onClose,
  desktopOnly,
  preventDefaultClose,
  loading
}: {
  children: React.ReactNode
  className?: string
  trigger?: React.ReactNode
  showModal?: boolean
  setShowModal?: Dispatch<SetStateAction<boolean>>
  onClose?: () => void
  desktopOnly?: boolean
  preventDefaultClose?: boolean
  loading?: boolean
}) {
  const navigate = useNavigate()

  const closeModal = ({ dragged }: { dragged?: boolean } = {}) => {
    if (preventDefaultClose && !dragged) {
      return
    }
    // fire onClose event if provided
    onClose && onClose()

    // if setShowModal is defined, use it to close modal
    if (setShowModal) {
      setShowModal(false)
      // else, this is intercepting route @modal
    } else {
      navigate(-1)
    }
  }
  const { isMobile } = useMediaQuery()

  if (isMobile && !desktopOnly) {
    return (
      <Drawer.Root
        open={setShowModal ? showModal : undefined}
        onOpenChange={(open) => {
          if (!open) {
            closeModal({ dragged: true })
          }
        }}
      >
        <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-gray-100 bg-opacity-10 backdrop-blur" />
        <Drawer.Portal>
          <Drawer.Content
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 rounded-t-[10px] border-t border-gray-200 bg-white",
              className
            )}
          >
            <div className="sticky top-0 z-20 flex w-full items-center justify-center rounded-t-[10px] bg-inherit">
              <div className="my-3 h-1 w-12 rounded-full bg-gray-300" />
            </div>
            {loading ? (
              <div className="flex py-32 justify-center">
                <LoadingCircle />
              </div>
            ) : (
              children
            )}
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    )
  }

  return (
    <Dialog.Root
      open={setShowModal ? showModal : undefined}
      onOpenChange={(open) => {
        if (!open) {
          closeModal()
        }
      }}
    >
      <Dialog.Trigger
        asChild
        onClick={() => {
          if (setShowModal) setShowModal(true)
        }}
      >
        {trigger}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          // for detecting when there's an active opened modal
          id="modal-backdrop"
          className="animate-fade-in fixed inset-0 z-40 bg-gray-100 bg-opacity-50 backdrop-blur-xs"
        />
        <Dialog.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className={cn(
            "animate-scale-in fixed inset-0 z-40 m-auto max-h-fit w-full max-w-md overflow-hidden border border-gray-200 bg-white p-0 shadow-xl sm:rounded-2xl",
            className
          )}
        >
          <Dialog.Title />
          <Dialog.Description />

          {loading ? (
            <div className="flex py-32 justify-center">
              <LoadingCircle />
            </div>
          ) : (
            children
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
