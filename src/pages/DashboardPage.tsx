import { useState } from "react";
import DashboardLayout, { DashboardTab } from "@/components/dashboard/DashboardLayout";
import DashboardHome from "@/components/dashboard/DashboardHome";
import LearningRoadmap from "@/components/dashboard/LearningRoadmap";
import Toolkit from "@/components/dashboard/Toolkit";
import CommunityFeed from "@/components/dashboard/CommunityFeed";
import ThesisBuilder from "@/components/dashboard/ThesisBuilder";
import EventsSection from "@/components/dashboard/EventsSection";
import DashboardSettings from "@/components/dashboard/DashboardSettings";
import ContentLibrary from "@/components/dashboard/ContentLibrary";
import PortfolioTab from "@/components/dashboard/PortfolioTab";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("home");

  const renderTab = () => {
    switch (activeTab) {
      case "home": return <DashboardHome onTabChange={setActiveTab} />;
      case "content": return <ContentLibrary />;
      case "portfolio": return <PortfolioTab />;
      case "progress": return <LearningRoadmap />;
      case "tools": return <Toolkit />;
      case "community": return <CommunityFeed />;
      case "theses": return <ThesisBuilder />;
      case "events": return <EventsSection />;
      case "settings": return <DashboardSettings />;
      default: return <DashboardHome onTabChange={setActiveTab} />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderTab()}
    </DashboardLayout>
  );
};

export default DashboardPage;
