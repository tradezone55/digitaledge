import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CustomModal({
  title,
  description,
  children,
  open,
  onOpenChange,
  trigger,
  closable = true,
}: CustomModalProps) {
  return (
    <Dialog open={open} onOpenChange={closable ? onOpenChange : undefined}>
      {
        trigger && (
          <DialogTrigger asChild>
            {trigger}
          </DialogTrigger>
        )
      }
      <DialogContent
        className="sm:max-w-[425px] bg-gray-700 text-white"
        onPointerDownOutside={(e) => {
          if (!closable) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (!closable) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

interface CustomModalProps {
  title: string;
  description: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
  closable?: boolean;
}