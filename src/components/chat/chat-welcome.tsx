'use client';

import { ArrowUp } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global-store-provider';
import { useMutationSendMessage } from '@/hooks/use-mutation-send-message';

type Props = React.ComponentProps<'div'>;

const EXAMPLE_MESSAGES = [
  `Recommend me a hidden gem I probably haven't seen`,
  `I want a mind-bending thriller with a twist ending`,
  `Suggest a cozy movie for a rainy day`,
  `What are some must-watch documentaries?`,
];

export const ChatWelcome = ({ className, ...props }: Props) => {
  const isInput = useGlobalStore((s) => s.defaultInputValue.length > 0);

  const sendMessage = useMutationSendMessage();

  if (isInput) {
    return null;
  }
  return (
    <div
      className={cn('flex flex-col justify-center px-6', 'animate-in zoom-in-90 fade-in', className)}
      {...props}
    >
      <h1 className="text-foreground-0/90 mb-6 text-2xl font-bold antialiased">
        What do you feel like watching today?
      </h1>

      <ul className="flex flex-col">
        {EXAMPLE_MESSAGES.map((message, i) => (
          <li key={i} className="border-foreground-0/5 border-b py-2 last:border-0">
            <button
              className="group text-foreground-1 hover:bg-foreground-0/5 focus-visible:ring-ring flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-left text-sm font-medium whitespace-nowrap transition select-none focus:outline-none focus-visible:ring-2"
              onClick={() => sendMessage.mutate(message)}
            >
              {message}
              <ArrowUp
                className="text-foreground-1 invisible ml-auto size-5 transition group-hover:visible group-focus:visible"
                strokeWidth={1.5}
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
