import React from 'react';
import CineSequencer from './CineSequencer';
import { AdCampaignResult } from '../types';

interface SequencerProps {
    onSaveHistory: (input: string, output: AdCampaignResult, imageBase64?: string) => void;
}

const Sequencer: React.FC<SequencerProps> = (props) => {
    return <CineSequencer {...props} />;
};

export default Sequencer;
