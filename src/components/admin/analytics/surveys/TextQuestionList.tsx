import React from 'react';

interface TextQuestionListProps {
  result: {
    questionText: string;
    summary: {
      responses: string[];
    };
  };
}

const TextQuestionList: React.FC<TextQuestionListProps> = ({ result }) => (
  <div className="mb-8">
    <h3 className="text-lg font-bold text-foreground mb-2">{result.questionText}</h3>
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {result.summary.responses.length > 0 ? (
        result.summary.responses.map((response, idx) => (
          <div key={idx} className="p-3 rounded-lg border bg-muted/30 text-sm text-foreground">
            {response}
          </div>
        ))
      ) : (
        <div className="text-muted-foreground text-sm">No responses yet.</div>
      )}
    </div>
  </div>
);

export default TextQuestionList;
