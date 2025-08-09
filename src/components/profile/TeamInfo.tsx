import React from 'react';
import { AiOutlineTeam, AiOutlineFire } from 'react-icons/ai';

interface TeamInfoProps {
  team: string;
  coach: string;
}

const TeamInfo: React.FC<TeamInfoProps> = ({ team, coach }) => {
  return (
    <div className="team-info">
      <p><AiOutlineTeam /> {team}</p>
      <p><AiOutlineFire /> Coach: {coach}</p>
    </div>
  );
};

export default TeamInfo;
