import React from "react";
import { Routes, Route } from "react-router";
import Sidebar from "../components/Sidebar";
import ContentView from "../components/ContentView";
import Profile from "../app/profiles/views/Profile";
import Groups from "../app/groups/views/Groups";
import Events from "../app/events/views/EventsPage";
import Search from "../app/search/views/Search";
import Programs from "../app/programs/views/Programs";
import ProgramBuilder from "../app/programs/views/ProgramBuilder";
import ProgramView from "../app/programs/views/ProgramView";
import WeekView from "../app/programs/views/WeekView";
import WorkoutView from "../app/programs/views/WorkoutView";

import {
  AiOutlineHome,
  AiOutlineUser,
  // AiOutlineTeam,
  // AiOutlineCalendar,
  AiOutlineSearch,
  AiOutlineSchedule
} from "react-icons/ai";

const Dashboard: React.FC = () => {
  const tabs = [
    { id: "", label: "Home", icon: <AiOutlineHome /> }, // id "" so route = "/"
    { id: "programs", label: "Programs", icon: <AiOutlineSchedule /> },
    { id: "profile", label: "Profile", icon: <AiOutlineUser /> },
    // { id: "groups", label: "Groups", icon: <AiOutlineTeam /> },
    // { id: "events", label: "Events", icon: <AiOutlineCalendar /> },
    { id: "search", label: "Search", icon: <AiOutlineSearch /> },
    ];

  return (
    <div className="app-container">
      <Sidebar tabs={tabs} />
      <ContentView>
          <Routes>
            <Route path="/" element={<><h1>Home Content</h1><p>This is the home tab content area.</p></>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/events" element={<Events />} />
            <Route path="/search" element={<Search />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/builder" element={<ProgramBuilder />} />
            <Route path="/programs/:programId" element={<ProgramView />} />
            <Route path="/programs/:programId/weeks/:weekId" element={<WeekView />} />
            <Route path="/programs/:programId/weeks/:weekId/workouts/:workoutId" element={<WorkoutView />} />
          </Routes>
      </ContentView>
    </div>
  );
};

export default Dashboard;
