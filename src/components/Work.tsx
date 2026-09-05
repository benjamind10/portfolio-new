import React, { useState } from 'react';
import { CASE_STUDIES, WORK_COPY } from '../content/caseStudies';
import SectionHeader from './common/SectionHeader';
import FadeInWrapper from './common/FadeInWrapper';
import CaseStudyGrid from './work/CaseStudyGrid';

const Work: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const toggle = (id: string) =>
    setSelectedId(current => (current === id ? null : id));

  return (
    <section id="work" className="scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <FadeInWrapper>
          <SectionHeader
            title={WORK_COPY.title}
            subtitle={WORK_COPY.subtitle}
          />
        </FadeInWrapper>

        <FadeInWrapper delay={0.1}>
          <CaseStudyGrid
            studies={CASE_STUDIES}
            selectedId={selectedId}
            onSelect={toggle}
          />
        </FadeInWrapper>
      </div>
    </section>
  );
};

export default Work;
