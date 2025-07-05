import React from 'react';
import TableWithButtons from '@/Components/TableWithButtons';
import ButtonExamples from '@/Components/ButtonExamples';

const ShadcnDemo = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Shadcn/UI Components Demo
        </h1>
        
        <div className="space-y-8">
          {/* Button Examples Section */}
          <div className="bg-card rounded-lg border shadow-sm">
            <ButtonExamples />
          </div>
          
          {/* Table with Buttons Section */}
          <div className="bg-card rounded-lg border shadow-sm">
            <TableWithButtons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShadcnDemo;
