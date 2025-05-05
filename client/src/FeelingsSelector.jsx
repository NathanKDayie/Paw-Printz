import React, { useState } from 'react';
import Select, { GroupBase, MultiValue } from 'react-select';

const emotionData = [
  {
    label: 'Fear',
    options: [
      { label: 'Scared', value: 'Scared' },
      { label: 'Anxious', value: 'Anxious' },
      { label: 'Helpless', value: 'Helpless' },
      { label: 'Overwhelmed', value: 'Overwhelmed' },
    ],
  },
  {
    label: 'Anger',
    options: [
      { label: 'Frustrated', value: 'Frustrated' },
      { label: 'Mad', value: 'Mad' },
      { label: 'Betrayed', value: 'Betrayed' },
      { label: 'Resentful', value: 'Resentful' },
    ],
  },
  {
    label: 'Sadness',
    options: [
      { label: 'Lonely', value: 'Lonely' },
      { label: 'Disappointed', value: 'Disappointed' },
      { label: 'Guilty', value: 'Guilty' },
      { label: 'Depressed', value: 'Depressed' },
    ],
  },
  {
    label: 'Joy',
    options: [
      { label: 'Happy', value: 'Happy' },
      { label: 'Proud', value: 'Proud' },
      { label: 'Thankful', value: 'Thankful' },
      { label: 'Playful', value: 'Playful' },
    ],
  },
  // Add more categories as needed
];

const EmotionSelector = ({ onSubmit }) => {
    const [selected, setSelected] = useState([]);

    const handleChange = (options = []) => {
        if (options.length <= 5) {
            setSelected(options);
        }
        };
        

  const handleSubmit = () => {
    onSubmit(selected.map((opt) => opt.value));
  };

  return (
    <div className="emotion-selector">
      <h2>Select up to 5 emotions</h2>
      <Select
        options={emotionData}
        isMulti
        value={selected}
        onChange={handleChange}
        closeMenuOnSelect={false}
        placeholder="How are you feeling?"
      />
      <button
        onClick={handleSubmit}
        disabled={selected.length === 0}
        className="mt-4 p-2 bg-blue-600 text-white rounded-md"
      >
        Submit Emotions
      </button>
    </div>
  );
};

export default EmotionSelector;
