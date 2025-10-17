import { useLocation } from '@tanstack/react-router';

import { cn } from '~/lib/utils';
import { useGlobalStore } from '~/stores/global-store-provider';
import { useDerivedIsNewChat } from '~/hooks/use-query-get-chats';
import { useChatContext } from './chat-context-provider';

type Props = React.ComponentProps<'div'>;

const EXAMPLE_MESSAGES = [
  `Recommend me a hidden gem I probably haven't seen`,
  `I want a mind-bending thriller with a twist ending`,
  `Suggest a cozy movie for a rainy day`,
  `I'm in the mood for a classic black-and-white film`,
];

export const ChatWelcome = ({ className, ...props }: Props) => {
  const { conversationId } = useChatContext();

  const location = useLocation();

  const dispatch = useGlobalStore((s) => s.dispatch);

  const isNewChat = useDerivedIsNewChat(conversationId);

  if (!isNewChat || location.pathname !== '/') {
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
              onClick={() =>
                dispatch({
                  type: 'SET_CHAT_VALUE',
                  payload: { conversationId, value: message, isNewChat },
                })
              }
            >
              {message}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
