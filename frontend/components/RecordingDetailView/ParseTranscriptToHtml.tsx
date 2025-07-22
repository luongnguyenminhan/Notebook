import React from 'react';

interface ParseTranscriptToHtmlProps {
  transcriptArr: any[];
  textColor: string;
  borderColor: string;
}

const ParseTranscriptToHtml: React.FC<ParseTranscriptToHtmlProps> = ({
  transcriptArr,
  textColor,
  borderColor,
}) => {
  if (!Array.isArray(transcriptArr)) return null;
  // Tạo màu cho từng speaker
  const speakerColors = [
    '#0070f3',
    '#ff9800',
    '#43a047',
    '#d81b60',
    '#6d4cff',
    '#00897b',
  ];
  const speakerMap: Record<string, string> = {};
  let colorIdx = 0;
  transcriptArr.forEach((item) => {
    if (!speakerMap[item.speaker]) {
      speakerMap[item.speaker] = speakerColors[colorIdx % speakerColors.length];
      colorIdx++;
    }
  });
  return (
    <div style={{ lineHeight: 1.8 }}>
      {transcriptArr.map((item, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: 4,
            padding: '6px 0',
            borderBottom: `1px solid ${borderColor}`,
            display: 'flex',
            alignItems: 'flex-start',
            color: textColor,
          }}
        >
          <span
            style={{
              fontWeight: 700,
              color: speakerMap[item.speaker],
              marginRight: 12,
              minWidth: 110,
              display: 'inline-block',
            }}
          >
            {item.speaker}:
          </span>
          <span style={{ color: textColor, fontSize: 16 }}>
            {item.sentence}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ParseTranscriptToHtml;
