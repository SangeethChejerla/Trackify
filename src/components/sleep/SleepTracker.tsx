'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Toaster } from '@/components/ui/sonner';
import { BarChart, Monitor, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ScreenTimeForm } from './ScreenTime';
import { SleepChart } from './SleepChart';
import { SleepForm } from './Sleepform';
import { StatsCards } from './SleepStats';

export default function SleepTracker() {
  const router = useRouter();
  const handleSubmitSuccess = () => {
    // Trigger a refresh of the current page after form submission
    router.refresh();
  };
  return (
    <div className="container mx-auto py-10 space-y-8">
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
          <TabsTrigger value="analytics" className="space-x-2">
            <BarChart className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="sleep" className="space-x-2">
            <Moon className="h-4 w-4" />
            <span>Sleep</span>
          </TabsTrigger>
          <TabsTrigger value="screen" className="space-x-2">
            <Monitor className="h-4 w-4" />
            <span>Screen Time</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="analytics" className="mt-6">
          <SleepChart />
          <StatsCards />
        </TabsContent>
        <TabsContent value="sleep">
          <SleepForm
            onSubmitSuccess={() => {
              // Refresh data
            }}
          />
        </TabsContent>
        <TabsContent value="screen">
          <ScreenTimeForm
            onSubmitSuccess={handleSubmitSuccess} // Refresh data
          />
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  );
}
