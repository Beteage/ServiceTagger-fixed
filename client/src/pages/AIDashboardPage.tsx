import React from 'react';
import AIChat from '../components/AIChat';
import MainLayout from '../components/MainLayout';


const AIDashboardPage: React.FC = () => {
    return (
        <MainLayout>
            <div className="h-[calc(100vh-64px)] w-full bg-white flex flex-col">
                <AIChat />
            </div>
        </MainLayout>
    );
};


export default AIDashboardPage;
