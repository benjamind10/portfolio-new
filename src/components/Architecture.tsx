import React, { useState } from 'react';
import {
  AGENTIC_LAYER,
  ARCHITECTURE_COPY,
  TIERS,
} from '../content/architecture';
import SectionHeader from './common/SectionHeader';
import FadeInWrapper from './common/FadeInWrapper';
import ArchitectureDiagram, {
  type SelectionId,
} from './architecture/ArchitectureDiagram';
import TierDetail, { AgenticDetail } from './architecture/TierDetail';

const Architecture: React.FC = () => {
  const [selectedId, setSelectedId] = useState<SelectionId>('broker');
  const selectedTier = TIERS.find(tier => tier.id === selectedId);

  return (
    <section
      id="architecture"
      className="scroll-mt-24 bg-gray-50/70 dark:bg-gray-800/30"
    >
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <FadeInWrapper>
          <SectionHeader
            title={ARCHITECTURE_COPY.title}
            subtitle={ARCHITECTURE_COPY.subtitle}
          />
        </FadeInWrapper>

        <FadeInWrapper delay={0.1}>
          <ArchitectureDiagram
            tiers={TIERS}
            agentic={AGENTIC_LAYER}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </FadeInWrapper>

        <div className="mt-8">
          {selectedTier ? (
            <TierDetail tier={selectedTier} />
          ) : (
            <AgenticDetail components={AGENTIC_LAYER} />
          )}
        </div>
      </div>
    </section>
  );
};

export default Architecture;
