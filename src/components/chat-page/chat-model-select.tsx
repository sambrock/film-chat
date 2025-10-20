import { ChevronDown } from 'lucide-react';

import { Model, models } from '~/lib/ai/models';
import { cn } from '~/lib/utils';
import { useGlobalStore } from '~/stores/global-store-provider';
import { ProviderIcon } from '../shared/provider-icon';
import { Button } from '../ui/button';
import { DropdownContent, DropdownItem, DropdownRoot, DropdownTrigger } from '../ui/dropdown';
import { useChatContext } from './chat-context-provider';

export const ChatModelSelect = () => {
  const { conversationId } = useChatContext();

  const selectedModel = useGlobalStore((s) => s.model.get(conversationId) || s.defaultModel);
  const dispatch = useGlobalStore((s) => s.dispatch);

  const handleSelect = (model: Model) => {
    if (!models.get(model)!.active) {
      return;
    }
    dispatch({ type: 'SET_MODEL', payload: { conversationId, model } });
  };

  return (
    <DropdownRoot>
      <DropdownTrigger asChild>
        <Button variant="ghost" className="!text-foreground-0/60 !rounded-full !px-2">
          {models.get(selectedModel)?.name}
          <ChevronDown className="size-5" />
        </Button>
      </DropdownTrigger>

      <DropdownContent className="min-w-80 origin-bottom-left" align="start" side="top" sideOffset={2}>
        {[...models.values()].map((model) => (
          <DropdownItem
            key={model.model}
            className={cn('h-8', model.model === selectedModel && 'bg-background-1/50')}
            onClick={() => {
              handleSelect(model.model);
            }}
            disabled={!model.active}
          >
            <div className="flex items-center gap-3">
              <ProviderIcon
                className="text-foreground-0/80 size-4 antialiased"
                provider={model.provider}
                title={model.provider}
              />
              <span className="font-medium">{model.name}</span>
              {!model.active && <div className="ml-auto text-xs">(unavailable)</div>}
            </div>
          </DropdownItem>
        ))}
      </DropdownContent>
    </DropdownRoot>
  );
};
