import React from 'react';
import type { CaseStudy } from '../../content/caseStudies';
import CaseStudyCard from './CaseStudyCard';
import CaseStudyPanel from './CaseStudyPanel';

interface CaseStudyGridProps {
  studies: readonly CaseStudy[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const panelId = (id: string) => `case-study-${id}-panel`;

/**
 * Card grid with an inline expanding panel. The panel is rendered right after
 * its card and spans every column; dense grid flow lets the cards that follow
 * back-fill the rest of the card's row, so the panel opens directly beneath
 * the row that was clicked at any column count.
 */
const CaseStudyGrid: React.FC<CaseStudyGridProps> = ({
  studies,
  selectedId,
  onSelect,
}) => (
  <div className="grid grid-flow-row-dense gap-4 md:grid-cols-2 lg:grid-cols-3">
    {studies.map(study => (
      <React.Fragment key={study.id}>
        <CaseStudyCard
          study={study}
          expanded={study.id === selectedId}
          panelId={panelId(study.id)}
          onSelect={onSelect}
        />
        {study.id === selectedId && (
          <CaseStudyPanel study={study} id={panelId(study.id)} />
        )}
      </React.Fragment>
    ))}
  </div>
);

export default CaseStudyGrid;
