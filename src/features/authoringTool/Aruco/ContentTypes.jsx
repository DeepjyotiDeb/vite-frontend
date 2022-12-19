export const ContentType = [
  {
    name: 'Question',
    value: 'question',
    contentSubType: [
      { name: 'Subjective', value: 'subjective' },
      { name: 'Checkbox', value: 'checkbox' },
      { name: 'ASCII Math', value: 'handwritten_number' },
      { name: 'Integer', value: 'integer' },
      { name: 'Decimal', value: 'decimal' },
      { name: 'English', value: 'english' },
      { name: 'Japanese', value: 'japanese' },
      { name: 'English Character', value: 'english_character' },
      { name: 'Japanese Character', value: 'japanese_character' },
    ],
  },
  {
    name: 'Student Info',
    value: 'studentInfo',
    contentSubType: [
      { name: 'Name', value: 'name' },
      { name: 'Number', value: 'number' },
    ],
  },
  // {
  //   name: 'Page Info',
  //   value: 'pageInfo',
  //   contentSubType: [{ name: 'QR', value: 'qr' }],
  // },
];

export const ContentSubtypeList = ContentType.flatMap(
  (item) => item.contentSubType
);
