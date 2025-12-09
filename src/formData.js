export const formSections = [
  {
    id: 'facility-info',
    title: 'Facility Information',
    questions: [
      {
        id: 'facility-name',
        label: 'Facility Name',
        type: 'text',
        required: true,
      },
      {
        id: 'facility-type',
        label: 'Facility Type',
        type: 'select',
        options: ['Tower', 'TRACON', 'Combined'],
        required: true,
      },
      {
        id: 'facility-location',
        label: 'Facility Location',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    id: 'operations',
    title: 'Operations',
    questions: [
      {
        id: 'daily-operations',
        label: 'Average Daily Operations',
        type: 'number',
        required: true,
      },
      {
        id: 'operational-hours',
        label: 'Operational Hours',
        type: 'select',
        options: ['24/7', 'Daytime Only', 'Variable Schedule'],
        required: true,
      },
      {
        id: 'training-program',
        label: 'Training Program Status',
        type: 'select',
        options: ['Active', 'Limited', 'On Hold', 'Not Available'],
        required: true,
      },
      {
        id: 'sectors',
        label: 'List all radar sectors',
        type: 'text',
        required: true,
      },
    ],
  },

  {
    id: 'equipment',
    title: 'Equipment & Systems',
    questions: [
      {
        id: 'primary-system',
        label: 'Primary ATC System',
        type: 'text',
        required: true,
      },
      {
        id: 'scope-count',
        label: 'Number of radar scopes',
        type: 'number',
        required: true,
      },
      {
        id: 'gpw-count',
        label: 'Number of GPWs',
        type: 'number',
        required: true,
      },
    ],
  },
];
