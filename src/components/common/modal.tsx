'use client';

import * as React from 'react';
import { XIcon } from 'lucide-react';
import { Dialog as ModalPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

export const Modal = ({ ...props }: React.ComponentProps<typeof ModalPrimitive.Root>) => {
  return <ModalPrimitive.Root data-slot="modal" {...props} />;
};

export const ModalTrigger = ({ ...props }: React.ComponentProps<typeof ModalPrimitive.Trigger>) => {
  return <ModalPrimitive.Trigger data-slot="modal-trigger" {...props} />;
};

export const ModalPortal = ({ ...props }: React.ComponentProps<typeof ModalPrimitive.Portal>) => {
  return <ModalPrimitive.Portal data-slot="modal-portal" {...props} />;
};

export const ModalClose = ({ ...props }: React.ComponentProps<typeof ModalPrimitive.Close>) => {
  return <ModalPrimitive.Close data-slot="modal-close" {...props} />;
};

export const ModalOverlay = ({
  className,
  ...props
}: React.ComponentProps<typeof ModalPrimitive.Overlay>) => {
  return (
    <ModalPrimitive.Overlay
      data-slot="modal-overlay"
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/40',
        className
      )}
      {...props}
    />
  );
};

export const ModalContent = ({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof ModalPrimitive.Content> & {
  showCloseButton?: boolean;
}) => {
  return (
    <ModalPortal data-slot="modal-portal">
      <ModalOverlay />
      <ModalPrimitive.Content
        data-slot="Modal-content"
        className={cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <ModalPrimitive.Close
            data-slot="modal-close"
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </ModalPrimitive.Close>
        )}
      </ModalPrimitive.Content>
    </ModalPortal>
  );
};
export const ModalContentDrawer = ({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof ModalPrimitive.Content> & {
  showCloseButton?: boolean;
}) => {
  return (
    <ModalPortal data-slot="modal-portal">
      <ModalOverlay />
      <ModalPrimitive.Content
        className={cn(
          'bg-background-0 border-foreground-0/5 fixed top-0 right-0 z-50 h-screen w-3xl overflow-y-auto border-l outline-none',
          'bg-background data-[state=open]:animate-in data-[state=open]:slide-in-from-right-full data-[state=closed]:slide-out-to-right-full data-[state=closed]:animate-out duration-100',
          className
        )}
        data-slot="Modal-content"
        {...props}
      >
        {children}
      </ModalPrimitive.Content>
    </ModalPortal>
  );
};

export const ModalHeader = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="modal-header"
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  );
};

export const ModalFooter = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      data-slot="modal-footer"
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  );
};

export const ModalTitle = ({ className, ...props }: React.ComponentProps<typeof ModalPrimitive.Title>) => {
  return (
    <ModalPrimitive.Title
      data-slot="modal-title"
      className={cn('text-lg leading-none font-semibold', className)}
      {...props}
    />
  );
};

export const ModalDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof ModalPrimitive.Description>) => {
  return (
    <ModalPrimitive.Description
      data-slot="modal-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
};
