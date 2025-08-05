import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import DashboardLayout from '@/components/DashboardLayout';

const TestPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-white mb-4">Component Test Page</h1>
          <p className="text-gray-400 mb-6">This page tests all UI components to ensure they're working properly.</p>
          
          <div className="space-y-4">
            <div>
              <Label className="text-white">Test Input</Label>
              <Input placeholder="Test input field" className="mt-2" />
            </div>
            
            <div>
              <Label className="text-white">Test Select</Label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="test-switch" />
              <Label htmlFor="test-switch" className="text-white">Test Switch</Label>
            </div>
            
            <div className="flex space-x-2">
              <Button>Primary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="destructive">Destructive Button</Button>
            </div>
            
            <div className="flex space-x-2">
              <Badge>Default Badge</Badge>
              <Badge variant="secondary">Secondary Badge</Badge>
              <Badge variant="destructive">Destructive Badge</Badge>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TestPage; 