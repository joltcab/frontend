import { useState, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

const TabsContext = createContext();

export function Tabs({ defaultValue, children, className }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('w-full', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }) {
  return (
    <div className={cn('flex border-b border-gray-200', className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={cn(
        'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
        'hover:text-joltcab-600 hover:border-joltcab-300',
        'focus:outline-none focus:ring-2 focus:ring-joltcab-500 focus:ring-offset-2',
        isActive
          ? 'text-joltcab-600 border-joltcab-600'
          : 'text-gray-500 border-transparent',
        className
      )}
      role="tab"
      aria-selected={isActive}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }) {
  const { activeTab } = useContext(TabsContext);

  if (activeTab !== value) {
    return null;
  }

  return (
    <div 
      className={cn('pt-4', className)}
      role="tabpanel"
    >
      {children}
    </div>
  );
}
